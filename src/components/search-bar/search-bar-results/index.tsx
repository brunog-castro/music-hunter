import SearchBarResultsItem from "./item";
import { Track } from "../../../models/track/track";
import { Album } from "../../../models/album/album";
import { Artist } from "../../../models/artist/artist";
import { Result } from "../../../models/search-result/search-result";

import "./styles.scss";

interface PropTypes {
    selectedSearchType?: string;
    trackResults?: Result<Track>;
    albumResults?: Result<Album>;
    artistResults?: Result<Artist>;
    onItemClick(item: Album | Artist | Track): void;
}

export default function SearchBarResults(props: PropTypes) {
    const shouldRenderSection = (section: string) => {
        return props.selectedSearchType === "all" ||
            props.selectedSearchType === section;
    };

    const onItemClick = (item: Artist | Album | Track) => {
        props.onItemClick(item);
    };

    return (
        <div id="dropdown-results" className="dropdown">
            {shouldRenderSection("track") && props.trackResults?.items &&
                props.trackResults.items.length > 0 && <>
                    <div className="result-header tracks">
                        <span>Tracks</span>
                        <small>{props.trackResults.total} results</small>
                    </div>
                    <div className="tracks">
                        {props.trackResults.items.slice(0, 5).map(track =>
                            <SearchBarResultsItem
                                key={track.id}
                                title={track.name}
                                onClick={() => onItemClick(track)}
                                thumbnail={track.album?.images?.[0]?.url}
                                subtitle={track.artists?.map(a => a.name).join(", ")}
                            />
                        )}
                    </div>
                </>
            }
            {shouldRenderSection("artist") && props.artistResults?.items &&
                props.artistResults.items.length > 0 && <>
                    <div className="result-header artists">
                        <span>Artists</span>
                        <small>{props.artistResults.total} results</small>
                    </div>
                    <div className="artists">
                        {props.artistResults.items.slice(0, 5).map(artist =>
                            <SearchBarResultsItem
                                key={artist.id}
                                title={artist.name}
                                thumbnail={artist.images?.[0]?.url}
                                onClick={() => onItemClick(artist)}
                                subtitle={artist.genres?.join(", ")}
                            />
                        )}
                    </div>
                </>
            }
            {shouldRenderSection("album") && props.albumResults?.items &&
                props.albumResults.items.length > 0 && <>
                    <div className="result-header albums">
                        <span>Albums</span>
                        <small>{props.albumResults.total} results</small>
                    </div>
                    <div className="albums">
                        {props.albumResults.items.slice(0, 5).map(album =>
                            <SearchBarResultsItem
                                key={album.id}
                                title={album.name}
                                thumbnail={album.images?.[0]?.url}
                                onClick={() => onItemClick(album)}
                                subtitle={album.artists?.map(a => a.name).join(", ")}
                            />
                        )}
                    </div>
                </>
            }
        </div>
    );
}