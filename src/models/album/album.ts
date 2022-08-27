import { Track } from "../track/track";
import { Artist } from "../artist/artist";
import { Thumbnail } from "../misc/thumbnail";
import { Result } from "../search-result/search-result";

export type Album = {
    id: string;
    name: string;
    type: string;
    label?: string;
    artists: Artist[];
    total_tracks: number;
    release_date: string;
    images?: Thumbnail[];
    tracks?: Result<Track>;
}