import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { supabase } from "~/utils/db.server";
import { authStorage } from "~/utils/cookies";

type QueryResponse = {
    data:
        | {
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
          }[]
        | null;
    error: any;
};

type CurrentTile = {
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

export const action: ActionFunction = async ({ request }) => {
    try {
        // Get user from session
        const session = await authStorage.getSession(request.headers.get("Cookie"));
        const userCookie = session.get("user");

        if (!userCookie?.walletAddress) {
            throw new Error("No wallet address found in session");
        }

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
        const eventResult = processEvent(currentTile);

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

function processEvent(currentTile: CurrentTile) {
    console.log(currentTile);
    switch (currentTile.type.name) {
        case "Chance":
            return "You rolled a " + currentTile.type.description;
        case "Community Chest":
            return "You rolled a " + currentTile.type.description;
        case "Go":
            return "You rolled a " + currentTile.type.description;
        case "Prison":
            return "You rolled a " + currentTile.type.description;
        default:
            return "You rolled a " + currentTile.type.description;
    }
}
