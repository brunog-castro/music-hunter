import { Album } from "../album/album";
import { Track } from "../track/track";
import { Artist } from "../artist/artist";

export type SidebarConfig = {
    opened?: boolean;
    data?: Album | Artist | Track;
}