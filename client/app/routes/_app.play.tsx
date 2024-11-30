import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

import { Board } from "~/components/board";

const BOARD_TILES = [
    { id: 0, type: "go", color: "bg-green-400", effect: "None", colSpan: 2 },
    { id: 1, type: "partner", color: "bg-teal-600", effect: "Obtain Colour Coffee Tokens", colSpan: 1 },
    { id: 2, type: "chance", color: "bg-yellow-500", effect: "Draw a card", colSpan: 1 },
    { id: 3, type: "partner", color: "bg-teal-600", effect: "Obtain Colour Coffee Tokens", colSpan: 1 },
    { id: 4, type: "partner", color: "bg-indigo-800", effect: "Obtain Page Turners Tokens", colSpan: 1 },
    { id: 5, type: "community chest", color: "bg-purple-500", effect: "Open chest", colSpan: 1 },
    { id: 6, type: "partner", color: "bg-indigo-800", effect: "Obtain Page Turners Tokens", colSpan: 1 },
    { id: 7, type: "prison", color: "bg-green-400", effect: "TBD", colSpan: 2 },
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

function Dice({ value, rolling }: { value: number; rolling: boolean }) {
    return (
        <div className={`dice ${rolling ? "rolling" : ""}`}>
            <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-gray-800">
                {value}
            </div>
        </div>
    );
}

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
    const [isRolling, setIsRolling] = useState(false);
    const [diceValues, setDiceValues] = useState([1, 1]);

    const rollDice = () => {
        if (isRolling) return;

        setIsRolling(true);

        // Simulate dice rolling animation
        setTimeout(() => {
            const newDice1 = Math.floor(Math.random() * 6) + 1;
            const newDice2 = Math.floor(Math.random() * 6) + 1;
            setDiceValues([newDice1, newDice2]);

            const totalRoll = newDice1 + newDice2;

            setIsRolling(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-center">Play</h1>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full">
                <Board boardData={boardData} playerData={playerData} />
                {/* Dice Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-4">
                        <Dice value={diceValues[0]} rolling={isRolling} />
                        <Dice value={diceValues[1]} rolling={isRolling} />
                    </div>
                    <button
                        onClick={rollDice}
                        disabled={isRolling}
                        className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:bg-gray-600 transition-colors"
                    >
                        {isRolling ? "Rolling..." : "Roll Dice"}
                    </button>
                </div>
            </div>
        </div>
    );
}
