import { BuildingIcon, DiceIcon, CogIcon } from "./icons";
import { useState, useRef } from "react";

import type { Board, Player } from "~/routes/_app.play";

interface BoardProps {
    boardData: Board;
    playerData: Player;
}
export function Board({ boardData, playerData }: BoardProps) {
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
    return (
        <div
            ref={boardRef}
            className="overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div className="grid grid-flow-col auto-cols-[150px] w-max min-w-full mb-8 pb-4">
                {boardData.map((tile, index) => (
                    <Tile
                        key={index}
                        type={tile.type}
                        color={tile.color}
                        colSpan={tile.colSpan}
                        showPlayerAvatar={playerData.position === index}
                        PlayerAvatar={playerData.avatar}
                    />
                ))}
            </div>
        </div>
    );
}

interface TileProps {
    type: string;
    color: string;
    colSpan: number;
    showPlayerAvatar?: boolean;
    PlayerAvatar?: string;
}

export function Tile({ type, color, colSpan, showPlayerAvatar, PlayerAvatar }: TileProps) {
    const getIcon = () => {
        switch (type) {
            case "Chance":
                return <DiceIcon color={color} />;
            case "Community Chest":
                return <CogIcon color={color} />;
            case "Go":
            case "Prison":
                return <BuildingIcon color={color} />;
            default:
                return null;
        }
    };
    console.log(PlayerAvatar);

    return (
        <div className={`relative h-72 col-span-${colSpan} bg-gray-800 border-2 border-sky-400/80 select-none`}>
            {type === "Partner Tile" ? (
                // Partner tile with color band at top
                <div className="flex flex-col h-full">
                    <div className={`h-20 ${color}`} />
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-sm">{type}</span>
                        {showPlayerAvatar && PlayerAvatar && (
                            <img
                                src={PlayerAvatar}
                                alt="Player"
                                className="absolute w-12 h-12 z-10 rounded-full object-cover"
                            />
                        )}
                    </div>
                </div>
            ) : (
                // Other tile types with centered icon and text
                <div className="h-full flex flex-col items-center justify-center gap-2">
                    {getIcon()}
                    <span className="text-sm">{type}</span>
                    {showPlayerAvatar && PlayerAvatar && (
                        <img
                            src={PlayerAvatar}
                            alt="Player"
                            className="absolute w-12 h-12 z-10 rounded-full object-cover"
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export function Dice({ numberOfDice = 2 }: { numberOfDice?: number }) {
    const [diceValues, setDiceValues] = useState(Array(numberOfDice).fill(1));

    const rollDice = () => {
        const newValues = Array(numberOfDice)
            .fill(0)
            .map(() => Math.floor(Math.random() * 6) + 1);
        setDiceValues(newValues);
    };

    function Die({ value }: { value: number }) {
        return (
            <div className={`dice cursor-pointer`} onClick={rollDice}>
                <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-gray-800">
                    {value}
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-4 select-none">
            {diceValues.map((value, index) => (
                <Die key={index} value={value} />
            ))}
        </div>
    );
}
