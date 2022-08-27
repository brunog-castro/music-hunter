import { Thumbnail } from "../misc/thumbnail";

export type Artist = {
    id: string;
    name: string;
    type: string;
    genres?: string[];
    images?: Thumbnail[];
}