import { useEffect, useState } from "react";
import { Track } from "../../../models/track/track";
import { Album } from "../../../models/album/album";
import AlbumService from "../../../services/album-service";
import { millisecondsToString } from "../../../utils/timeConverter";

import musicIcon from "../../../assets/icons/music.svg";
import "./styles.scss";

interface PropTypes {
    album: Album;
}

export default function AlbumSidebar(props: PropTypes) {
    const [label, setLabel] = useState<string>();
    const [tracks, setTracks] = useState<Track[]>();

    useEffect(() => {
        if (props.album.tracks?.items) {
            setLabel(props.album.label);
            setTracks(props.album.tracks?.items);
            return;
        }
            
        AlbumService.getAlbum(props.album.id)
            .then(album => {
                setLabel(album.label);
                setTracks(album.tracks?.items);
            });
    }, [props.album]);

    return (
        <div className="sidebar-template">
            <div className="header-info">
                <img src={props.album.images?.[0]?.url || musicIcon} alt="thumbnail" />
                <div className="basic-info">
                    <div className="title">{props.album.name}</div>
                    <div className="subtitle">
                        by {props.album.artists.map(a => a.name).join(", ")}
                    </div>
                    <small>{label}</small>
                </div>
            </div>
            <div className="detailed-data">
                <div className="additional-info">
                    <label>Tracks: </label>
                    <span>{props.album.total_tracks}</span>
                </div>
                <div className="additional-info">
                    <label>Release Date: </label>
                    <span>{props.album.release_date || "-"}</span>
                </div>
            </div>
            <div className="track-list">
                <div className="title">Tracks</div>
                <div className="list">
                {tracks?.map(track =>
                    <div key={track.id} className="track-item">
                        <div>{track.track_number}.  {track.name}</div>
                        <div>
                            {millisecondsToString(track.duration_ms)}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};