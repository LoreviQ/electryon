import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";

// Dummy data
const BOARD_TILES = [
    { id: 0, type: "Go", color: "bg-blue-500", effect: "None", size: "lg" },
    { id: 1, type: "normal", color: "bg-blue-500", effect: "None", size: "md" },
    { id: 2, type: "chance", color: "bg-yellow-500", effect: "Draw a card", size: "md" },
    { id: 3, type: "normal", color: "bg-blue-500", effect: "None", size: "md" },
    { id: 4, type: "tax", color: "bg-red-500", effect: "Pay tax", size: "md" },
    { id: 5, type: "normal", color: "bg-blue-500", effect: "None", size: "md" },
    { id: 6, type: "chest", color: "bg-purple-500", effect: "Open chest", size: "md" },
    { id: 7, type: "normal", color: "bg-blue-500", effect: "None", size: "md" },
    { id: 8, type: "chance", color: "bg-yellow-500", effect: "Draw a card", size: "md" },
    { id: 9, type: "normal", color: "bg-blue-500", effect: "None", size: "md" },
    { id: 10, type: "normal", color: "bg-blue-500", effect: "None", size: "md" },
    { id: 11, type: "prison", color: "bg-blue-500", effect: "None", size: "lg" },
];

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
        playerPosition: 0,
        playerData: {
            name: "Player 1",
            avatar: "👤",
        },
    });
}

export default function Play() {
    const { playerPosition: initialPosition, playerData } = useLoaderData<typeof loader>();
    const [playerPosition, setPlayerPosition] = useState(initialPosition);
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
            const newPosition = (playerPosition + totalRoll) % BOARD_TILES.length;
            setPlayerPosition(newPosition);

            setIsRolling(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <h1 className="text-2xl font-bold">Game Board</h1>
            </div>

            {/* Game Board */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
                    {BOARD_TILES.map((tile, index) => (
                        <div
                            key={tile.id}
                            className={`relative w-20 h-20 ${tile.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                            {playerPosition === index && (
                                <div className="absolute text-4xl z-10">{playerData.avatar}</div>
                            )}
                            <span className="text-sm">{tile.type}</span>
                        </div>
                    ))}
                </div>

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
