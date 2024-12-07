import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { supabase } from "~/utils/db.server";
import { Board, Dice } from "~/components/board";

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

export type Tile = {
    id: number;
    type: string;
    color: string;
    effect: string;
    colSpan: number;
    partner?: {
        name: string;
        path_name: string;
        logo: string;
    };
};

export type Board = Tile[];

export type Player = {
    name: string;
    avatar: string;
    position: number;
};

export async function loader() {
    try {
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
            playerData: {
                name: "Player 1",
                avatar: "/images/default-avatar.png",
                position: 0,
            },
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
    const boardData = loaderData.boardData as Board;
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
