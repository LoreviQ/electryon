export type Database = {
    public: {
        Tables: {
            partners: {
                Row: Partner
                Insert: Omit<Partner, 'id'>
                Update: Partial<Omit<Partner, 'id'>>
            },
            boardTiles: {
                Row: BoardTile
                Insert: Omit<BoardTile, 'id'>
                Update: Partial<Omit<BoardTile, 'id'>>
            },
            boardTileTypes: {
                Row: BoardTileType
                Insert: Omit<BoardTileType, 'id'>
                Update: Partial<Omit<BoardTileType, 'id'>>
            }
        }
    }
}

export type Partner = {
    id: number;
    name: string;
    path_name: string;
    season: number;
    logo: string;
    description: string;
    market_cap: number;
    trade_volume: number;
    category: string;
    country: string;
    website: string;
    twitter: string;
    telegram: string;
};

export type BoardTile = {
    id: number;
    season: number;
    color: string;
    size: string;
    type: BoardTileType;
    order: number;
};

export type BoardTileType = {
    id: number;
    name: string;
    description: string;
    partners: Partner | null;
};