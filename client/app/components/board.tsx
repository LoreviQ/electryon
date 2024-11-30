import { CoinIcon, BuildingIcon, DiceIcon, CogIcon } from "./icons";

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
