import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Board, Dice } from "~/components/board";

const BOARD_TILES = [
    { id: 0, type: "start", color: "bg-green-400", effect: "None", colSpan: 2 },
    { id: 1, type: "partner", color: "bg-teal-600", effect: "Obtain Colour Coffee Tokens", colSpan: 1 },
    { id: 2, type: "chance", color: "bg-yellow-500", effect: "Draw a card", colSpan: 1 },
    { id: 3, type: "partner", color: "bg-teal-600", effect: "Obtain Colour Coffee Tokens", colSpan: 1 },
    { id: 4, type: "chest", color: "bg-purple-500", effect: "Open chest", colSpan: 1 },
    { id: 5, type: "partner", color: "bg-indigo-800", effect: "Obtain Page Turners Tokens", colSpan: 1 },
    { id: 6, type: "chance", color: "bg-yellow-500", effect: "Draw a card", colSpan: 1 },
    { id: 7, type: "partner", color: "bg-indigo-800", effect: "Obtain Page Turners Tokens", colSpan: 1 },
    { id: 8, type: "prison", color: "bg-green-400", effect: "TBD", colSpan: 2 },
];

export type Tile = {
    id: number;
    type: string;
    color: string;
    effect: string;
    colSpan: number;
};

export type Board = Tile[];

export type Player = {
    name: string;
    avatar: string;
    position: number;
};

export async function loader() {
    return json({
        playerData: {
            name: "Player 1",
            avatar: "👤",
            position: 0,
        },
        boardData: BOARD_TILES,
    });
}

export default function Play() {
    const { playerData, boardData } = useLoaderData<typeof loader>();

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
