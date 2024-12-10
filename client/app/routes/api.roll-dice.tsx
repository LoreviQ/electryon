import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

import type { EventResult } from "~/types/board";
import { supabase } from "~/utils/db.server";
import { authStorage } from "~/utils/cookies";
import { mintTokenToPlayer } from "~/utils/solana.server";
import { mintNFTToPlayer } from "~/utils/nft.server";
import { transferTokens } from "~/utils/solana.server";

type Tile = {
    id: number;
    type: {
        name: string;
        description: string;
        partner: {
            name: string;
            coin_mint: string;
            coin_symbol: string;
            coin_decimals: number;
        } | null;
    };
};

type QueryResponse = {
    data: Tile[] | null;
    error: any;
};

const FAKE_BONK_MINT = "3KFL98QBgCtXYXmYe68E1vKaL2wsBcKeiZ1dGJpaB9YW";
const TREASURY_WALLET = "H7Z3wbMdVuKcNHqc3ce3c4dpG58FFPuMgoBHkabeS6WC";
const FAKE_BONK_DECIMALS = 6;
const ROLL_COST = 1;

export const action: ActionFunction = async ({ request }) => {
    try {
        // Get user from session
        const session = await authStorage.getSession(request.headers.get("Cookie"));
        const userCookie = session.get("user");

        if (!userCookie?.walletAddress) {
            throw new Error("No wallet address found in session");
        }

        // Transfer BONK first
        const transferResult = await transferTokens(
            userCookie.walletAddress,
            TREASURY_WALLET,
            FAKE_BONK_MINT,
            ROLL_COST,
            FAKE_BONK_DECIMALS
        );

        if (!transferResult.success) {
            return json(
                {
                    error: "Failed to process payment. Please ensure you have enough BONK.",
                },
                { status: 400 }
            );
        }

        // below would be moved to seperate endpoint for processing user signing

        // Get user ID
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("wallet_address", userCookie.walletAddress)
            .single();

        if (userError) throw userError;

        // Get current position
        const { data: gameState, error: gameStateError } = await supabase
            .from("game_states")
            .select("position")
            .eq("user", user.id)
            .single();

        if (gameStateError) throw gameStateError;

        // Generate dice roll
        const formData = await request.formData();
        const numberOfDice = parseInt(formData.get("numberOfDice") as string);
        const diceValues = Array(numberOfDice)
            .fill(0)
            .map(() => Math.floor(Math.random() * 6) + 1);

        const diceSum = diceValues.reduce((a, b) => a + b, 0);
        const newPosition = gameState.position + diceSum;

        // Get board tiles
        const { data: tiles, error: tilesError } = (await supabase
            .from("boardTiles")
            .select(
                `
                id,
                type: boardTileTypes (
                    name, description,
                    partner: partners (
                        name, coin_mint, coin_symbol, coin_decimals
                    )
                )
            `
            )
            .eq("season", 1)
            .order("order", { ascending: true })) as QueryResponse;
        if (tilesError) throw tilesError;
        if (!tiles) throw new Error("No tiles found");
        const tilePosition = newPosition % tiles.length;
        const currentTile = tiles[tilePosition];
        const eventResult = await processEvent(userCookie.walletAddress, currentTile);

        // Update position
        const { error: updateError } = await supabase
            .from("game_states")
            .update({ position: newPosition })
            .eq("user", user.id);

        if (updateError) throw updateError;

        return json({ diceValues, eventResult });
    } catch (error) {
        console.error("Error in roll-dice action:", error);
        return json({ error: "Failed to process dice roll" }, { status: 500 });
    }
};
async function processEvent(walletAddress: string, currentTile: Tile) {
    let eventResult: EventResult = { result: "", signature: "" };

    switch (currentTile.type.name) {
        case "Chance":
            try {
                const mintResult = await mintNFTToPlayer("chance", walletAddress);
                eventResult.result = "You received a Chance NFT!";
                eventResult.signature = mintResult.signature;
            } catch (error) {
                console.error("Error minting Chance NFT:", error);
                eventResult.result = "Failed to mint Chance NFT";
            }
            break;
        case "Community Chest":
            try {
                const mintResult = await mintNFTToPlayer("community_chest", walletAddress);
                eventResult.result = "You received a Community Chest NFT!";
                eventResult.signature = mintResult.signature;
            } catch (error) {
                console.error("Error minting Community Chest NFT:", error);
                eventResult.result = "Failed to mint Community Chest NFT";
            }
            break;
        case "Go":
            eventResult.result = "You rolled a " + currentTile.type.description;
            break;
        case "Prison":
            eventResult.result = "You rolled a " + currentTile.type.description;
            break;
        case "Partner Tile":
            if (!currentTile.type.partner) throw new Error("Partner not found");
            try {
                const mintResult = await mintTokenToPlayer(
                    walletAddress,
                    currentTile.type.partner.coin_mint,
                    1, // amount to mint
                    currentTile.type.partner.coin_decimals
                );
                if (!mintResult.success) throw new Error("Minting failed");
                eventResult.result = "You gained a $" + currentTile.type.partner.coin_symbol;
                eventResult.signature = mintResult.signature;
            } catch (mintError) {
                console.error("Error minting tokens:", mintError);
            }
            break;
        default:
            eventResult.result = "You rolled a " + currentTile.type.description;
    }
    return eventResult;
}
