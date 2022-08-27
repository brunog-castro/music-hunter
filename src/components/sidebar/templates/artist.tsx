import { useEffect, useState } from "react";
import { Album } from "../../../models/album/album";
import { Artist } from "../../../models/artist/artist";
import AlbumService from "../../../services/album-service";

import musicIcon from "../../../assets/icons/music.svg";
import "./styles.scss";

interface PropTypes {
    artist: Artist;
}

export default function ArtistSidebar(props: PropTypes) {
    const [albums, setAlbums] = useState<Album[]>();

    useEffect(() => {
        AlbumService.getAlbumsFrom(props.artist.id)
            .then(albums => {
                setAlbums(albums.items);
            });
    }, [props.artist]);

    const getWikiLink = () => {
        const artistName = props.artist.name.replaceAll(' ', '_');
        return "https://en.wikipedia.org/wiki/" + artistName;
    };

    return (
        <div className="sidebar-template">
            <div className="header-info">
                <img 
                    alt="thumbnail" 
                    src={props.artist.images?.[0]?.url || musicIcon} 
                />
                <div className="basic-info">
                    <div className="title">{props.artist.name}</div>
                    <small>
                        {props.artist.genres?.join(", ")}
                    </small>
                </div>
            </div>
            <div className="detailed-data">
                <div className="additional-info">
                    <a 
                        target="_blank" 
                        className="btn" 
                        rel="noreferrer"
                        href={getWikiLink()} 
                    >
                        More info
                    </a>
                </div>
            </div>
            <div className="album-list">
                <div className="title">Albums</div>
                <div className="list">
                {albums?.map(album =>
                    <div key={album.id} className="album-item">
                        <div className="thumbnail">
                            <img 
                                alt="thumbnail" 
                                src={album.images?.[0]?.url || musicIcon} 
                            />
                        </div>
                        <div>
                            <div>{album.name}</div>
                            <small>
                                {album.total_tracks}{" "}
                                track{album.total_tracks > 1 && "s"}
                            </small>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};