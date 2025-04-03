export interface Game {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    genres: Genre[];
}

export interface Genre {
    id: number;
    name: string;
}
