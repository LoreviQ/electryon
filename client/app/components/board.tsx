import { CoinIcon, BuildingIcon, DiceIcon, CogIcon } from "./icons";
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
            case "chance":
                return <DiceIcon color={color} />;
            case "tax":
                return <CoinIcon color={color} />;
            case "chest":
                return <CogIcon color={color} />;
            case "start":
            case "finish":
                return <BuildingIcon color={color} />;
            default:
                return null;
        }
    };

    return (
        <div className={`relative h-40 col-span-${colSpan} bg-gray-800 border-2 border-sky-400/80`}>
            {type === "partner" ? (
                // Partner tile with color band at top
                <div className="flex flex-col h-full">
                    <div className={`h-12 ${color}`} />
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-sm">{type}</span>
                        {showPlayerAvatar && <div className="absolute text-4xl z-10">{PlayerAvatar}</div>}
                    </div>
                </div>
            ) : (
                // Other tile types with centered icon and text
                <div className="h-full flex flex-col items-center justify-center gap-2">
                    {getIcon()}
                    <span className="text-sm">{type}</span>
                    {showPlayerAvatar && <div className="absolute text-4xl z-10">{PlayerAvatar}</div>}
                </div>
            )}
        </div>
    );
}
