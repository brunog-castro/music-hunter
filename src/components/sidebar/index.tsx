import TrackSidebar from "./templates/track";
import AlbumSidebar from "./templates/album";
import ArtistSidebar from "./templates/artist";
import { Album } from "../../models/album/album";
import { Track } from "../../models/track/track";
import { Artist } from "../../models/artist/artist";
import { useSidebar } from "../../stores/sidebarStore";

import "./styles.scss";

export default function Sidebar() {
    const sidebar = useSidebar();
    const sidebarState = sidebar.getState();

    const close = () => {
        sidebar.setState({ 
            opened: false, 
            data: undefined
        });
    };
    
    const isTrack = (item: Artist | Album | Track): item is Track => {
        return item.type === "track";
    };
    
    const isArtist = (item: Artist | Album | Track): item is Artist => {
        return item.type === "artist";
    };

    const isAlbum = (item: Artist | Album | Track): item is Album => {
        return item.type === "album";
    };

    return (
        <div 
            id="sidebar" 
            className={"overlay" + (sidebarState.opened ? " opened" : "")}
        >
            <div className={"container " + sidebarState.data?.type}>
                <button onClick={close} className="close-btn">X</button>
                {sidebarState.data ?
                <>
                    {isTrack(sidebarState.data) && 
                        <TrackSidebar track={sidebarState.data} />
                    }
                    {isArtist(sidebarState.data) && 
                        <ArtistSidebar artist={sidebarState.data} />
                    }
                    {isAlbum(sidebarState.data) && 
                        <AlbumSidebar album={sidebarState.data} />
                    }
                </>
                :
                    <div>loading...</div>
                }
            </div>
        </div>
    );
}