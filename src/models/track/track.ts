import { Album } from "../album/album";
import { Artist } from "../artist/artist";

export type Track = {
    id: string;
    name: string;
    type: string;
    album?: Album;
    artists: Artist[];
    explicit?: boolean;
    duration_ms: number;
    preview_url?: string;
    track_number?: number;
}