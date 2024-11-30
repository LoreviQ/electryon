import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useRef } from "react";

import { Tile } from "~/components/board";

// Dummy data
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
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const boardRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (boardRef.current?.offsetLeft ?? 0));
        setScrollLeft(boardRef.current?.scrollLeft ?? 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        e.preventDefault();
        if (!boardRef.current) return;

        const x = e.pageX - boardRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        boardRef.current.scrollLeft = scrollLeft - walk;
    };

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
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full">
                <div
                    ref={boardRef}
                    className="overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide"
                    style={{
                        WebkitMaskImage: "linear-gradient(to right, black 90%, transparent 100%)",
                    }}
                >
                    <div
                        className="grid grid-flow-col mb-8 pb-4"
                        style={{
                            gridAutoColumns: "150px",
                            width: "fit-content",
                            minWidth: "100%",
                        }}
                    >
                        {BOARD_TILES.map((tile, index) => (
                            <Tile
                                key={index}
                                type={tile.type}
                                color={tile.color}
                                colSpan={tile.colSpan}
                                showPlayerAvatar={playerPosition === index}
                                PlayerAvatar={playerData.avatar}
                            />
                        ))}
                    </div>
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
