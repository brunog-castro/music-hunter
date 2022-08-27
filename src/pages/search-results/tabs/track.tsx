import { useEffect, useState } from "react";
import { Track } from "../../../models/track/track";
import Paginator from "../../../components/paginator";
import { useSidebar } from "../../../stores/sidebarStore";
import { Result } from "../../../models/search-result/search-result";
import SearchService, { SearchInOptions } from "../../../services/search-service";
import SearchBarResultsItem from "../../../components/search-bar/search-bar-results/item";

import "./styles.scss";

interface PropTypes {
    searchTerm: string;
}

export default function TracksTab(props: PropTypes) {
    const itemsPerPage = 10;
    const sidebar = useSidebar();

    const [loading, setLoading] = useState<boolean>(false);
    const [tracks, setTracks] = useState<Result<Track>>();
    const [currentPage, setCurrentPage] = useState<number>(0);

    useEffect(() => {
        setLoading(true);
        SearchService.search(
            props.searchTerm, 
            SearchInOptions.Track,
            { 
                limit: itemsPerPage,
                offset: currentPage * itemsPerPage,
            }
        )
            .then(result => {
                setTracks(result.tracks);
                setLoading(false);
            })
    }, [props.searchTerm, currentPage]);

    const onItemClick = (item: Track) => {
        sidebar.setState({
            data: item,
            opened: true,
        });
    };

    return (
        <div id="tracks-tab" className="tab">
            <div className="result-header tracks">
                <span className="title">Tracks</span>
                <div className="subtext">
                    {tracks?.total || "0"} results for "{props.searchTerm}"
                </div>
            </div>
        {loading && !tracks ? 
            <div>loading...</div>
        :
            (!tracks || tracks.items.length < 0 ?
                <div>No results found</div>
                :
                <>
                {loading && <div>loading...</div>}
                <div className="list tracks">
                    {tracks.items.map(track =>
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
            )
        }
        {tracks && 
            <Paginator
                totalHits={tracks.total}
                currentPage={currentPage}
                onChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
            />
        }
        </div>
    );
};