import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";

import type { Tile, Player } from "~/types/board";
import { supabase } from "~/utils/db.server";
import { Board, Dice } from "~/components/board";
import { authStorage } from "~/utils/cookies";

type QueryResponse = {
    data:
        | {
              color: string;
              size: string;
              order: number;
              type: {
                  name: string;
                  description: string;
                  partner: {
                      name: string;
                      path_name: string;
                      logo: string;
                  } | null;
              };
          }[]
        | null;
    error: any;
};

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        // Get session data
        const session = await authStorage.getSession(request.headers.get("Cookie"));
        const userCookie = session.get("user");

        if (!userCookie?.walletAddress) {
            throw new Error("No wallet address found in session");
        }

        // Get user data
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id, username, avatar")
            .eq("wallet_address", userCookie.walletAddress)
            .single();
        if (userError) throw userError;

        // Get or create game state
        const { data: gameState, error: gameStateError } = await supabase
            .from("game_states")
            .select("position")
            .eq("user", user.id)
            .single();
        if (gameStateError && gameStateError.code !== "PGRST116") {
            // PGRST116 is "not found" error, throws all errors except this
            throw gameStateError;
        }

        if (gameStateError) {
            // Create new game state
            const { error: createError } = await supabase
                .from("game_states")
                .insert([{ user: user.id, position: 0 }])
                .select("position")
                .single();
            if (createError) throw createError;
        }

        const userData = {
            name: user.username,
            avatar: user.avatar || "/images/default-avatar.png",
            position: gameState?.position || 0,
        };

        // Get board tiles
        const { data: boardTiles, error } = (await supabase
            .from("boardTiles")
            .select(
                `
                color, size, order, 
                type: boardTileTypes (
                    name, description,
                    partner: partners (
                        name, path_name, logo
                    )
                )`
            )
            .eq("season", 1)
            .order("order")) as QueryResponse;
        if (error) throw error;
        const formattedData =
            boardTiles?.map((tile) => ({
                id: tile.order,
                type: tile.type.name,
                color: tile.color,
                effect: tile.type.description,
                colSpan: tile.size === "lg" ? 2 : 1,
                partner: tile.type.partner || null,
            })) || [];

        return json({
            playerData: userData,
            boardData: formattedData,
        });
    } catch (error) {
        console.error("Database error:", error);
        return json({
            playerData: {
                name: "Player 1",
                avatar: "/images/default-avatar.png",
                position: 0,
            },
            boardData: [],
        });
    }
}

export default function Play() {
    const loaderData = useLoaderData<typeof loader>();
    const playerData = loaderData.playerData as Player;
    const boardData = loaderData.boardData as Tile[];
    return (
        <div className="space-y-6 min-w-0">
            <h1 className="text-4xl font-bold text-center">Play</h1>
            <div className="bg-gray-800 rounded-lg p-6 min-w-0 mx-auto overflow-hidden">
                <Board boardData={boardData} playerData={playerData} />
                {/* Dice Section */}
                <div className="flex flex-col items-center">
                    <Dice numberOfDice={1} />
                </div>
            </div>
        </div>
    );
}
