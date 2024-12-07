import { BuildingIcon, DiceIcon, CogIcon, ChanceIcon, CommunityChestIcon, GoIcon, PrisonIcon } from "./icons";
import { useState, useRef } from "react";

import type { Board, Player, Tile } from "~/routes/_app.play";

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
                        tile={tile}
                        showPlayerAvatar={playerData.position === index}
                        PlayerAvatar={playerData.avatar}
                    />
                ))}
            </div>
        </div>
    );
}

interface TileProps {
    tile: Tile;
    showPlayerAvatar?: boolean;
    PlayerAvatar?: string;
}

export function Tile({ tile, showPlayerAvatar, PlayerAvatar }: TileProps) {
    const getIcon = () => {
        switch (tile.type) {
            case "Chance":
                return <ChanceIcon color={tile.color} width="w-24" height="h-24" />;
            case "Community Chest":
                return <CommunityChestIcon color={tile.color} width="w-24" height="h-24" />;
            case "Go":
                return <GoIcon color={tile.color} width="w-24" height="h-24" />;
            case "Prison":
                return <PrisonIcon color={tile.color} width="w-24" height="h-24" />;
            default:
                return tile.partner ? (
                    <div className="p-2">
                        <img src={tile.partner.logo} alt="Partner" className="w-full rounded-lg" />
                    </div>
                ) : null;
        }
    };

    return (
        <div className={`relative h-72 col-span-${tile.colSpan} bg-gray-800 border-2 border-sky-400/80 select-none`}>
            <div className="h-full flex flex-col">
                {/* Color block for Partner Tile */}
                {tile.type === "Partner Tile" && <div className={`h-20 ${tile.color}`} />}

                {/* Tile content */}
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    {/* Tile name */}
                    <span className="text-sm">{tile.partner ? tile.partner.name : tile.type}</span>

                    {/* Icon */}
                    {getIcon()}

                    {/* Player Avatar */}
                    {showPlayerAvatar && PlayerAvatar && (
                        <img
                            src={PlayerAvatar}
                            alt="Player"
                            className="absolute w-12 h-12 z-10 rounded-full object-cover"
                        />
                    )}
                </div>
            </div>
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
