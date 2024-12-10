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

export type Player = {
    name: string;
    avatar: string;
    position: number;
};

export type EventResult = {
    result: string;
    signature: string;
};