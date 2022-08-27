import { Track } from "../../../models/track/track";

import musicIcon from "../../../assets/icons/music.svg";
import { millisecondsToString } from "../../../utils/timeConverter";

import "./styles.scss";

interface PropTypes {
    track: Track;
}

export default function TrackSidebar(props: PropTypes) {
    return (
        <div className="sidebar-template">
            <div className="header-info">
                <img 
                    alt="thumbnail" 
                    src={props.track.album?.images?.[0]?.url || musicIcon} 
                />
                <div className="basic-info">
                    <div className="title">{props.track.name}</div>
                    <div className="subtitle">
                        by {props.track.artists.map(a => a.name).join(", ")}
                    </div>
                </div>
            </div>
            <div className="detailed-data">
                <div className="additional-info">
                    <label>Duration: </label>
                    <span>{millisecondsToString(props.track.duration_ms)}</span>
                </div>
                <div className="additional-info">
                    <label>Album: </label>
                    <span>{props.track.album?.name || "-"}</span>
                </div>
                <div className="additional-info">
                    <label>Release Date: </label>
                    <span>{props.track.album?.release_date || "-"}</span>
                </div>
            </div>
            {props.track.preview_url &&
                <div className="track-preview">
                    <div className="title">Preview</div>
                    <audio src={props.track.preview_url} controls>
                        Wow, your browser is so old that it can't play audios.
                    </audio>
                </div>
            }
        </div>
    );
};