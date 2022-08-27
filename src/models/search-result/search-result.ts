import { Track } from "../track/track";
import { Album } from "../album/album";
import { Artist } from "../artist/artist";

export type SearchResult = {
    tracks: Result<Track>;
    albums: Result<Album>;
    artists: Result<Artist>;
}

export type Result<T> = {
    items: T[];
    href: string;
    total: number;
    limit: number;
    offset: number; 
}