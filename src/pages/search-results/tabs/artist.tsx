import { useEffect, useState } from "react";
import { Artist } from "../../../models/artist/artist";
import Paginator from "../../../components/paginator";
import { useSidebar } from "../../../stores/sidebarStore";
import { Result } from "../../../models/search-result/search-result";
import SearchService, { SearchInOptions } from "../../../services/search-service";
import SearchBarResultsItem from "../../../components/search-bar/search-bar-results/item";

import "./styles.scss";

interface PropTypes {
    searchTerm: string;
}

export default function ArtistTab(props: PropTypes) {
    const itemsPerPage = 10;
    const sidebar = useSidebar();

    const [loading, setLoading] = useState<boolean>(false);
    const [artists, setArtists] = useState<Result<Artist>>();
    const [currentPage, setCurrentPage] = useState<number>(0);

    useEffect(() => {
        setLoading(true);
        SearchService.search(
            props.searchTerm, 
            SearchInOptions.Artist,
            { 
                limit: itemsPerPage,
                offset: currentPage * itemsPerPage,
            }
        )
            .then(result => {
                setArtists(result.artists);
                setLoading(false);
            })
    }, [props.searchTerm, currentPage]);

    const onItemClick = (item: Artist) => {
        sidebar.setState({
            data: item,
            opened: true,
        });
    };

    return (
        <div id="artists-tab" className="tab">
            <div className="result-header artist">
                <span className="title">Artists</span>
                <div className="subtext">
                    {artists?.total || "0"} results for "{props.searchTerm}"
                </div>
            </div>
        {loading && !artists ? 
            <div>loading...</div>
        :
            (!artists || artists.items.length < 0 ?
                <div>No results found</div>
                :
                <>
                {loading && <div>loading...</div>}
                <div className="list artists">
                    {artists.items.map(artist =>
                        <SearchBarResultsItem
                            key={artist.id}
                            title={artist.name}
                            onClick={() => onItemClick(artist)}
                            thumbnail={artist?.images?.[0]?.url}
                            subtitle={artist.genres?.join(", ")}
                        />
                    )}
                </div>
                </> 
            )
        }
        {artists && 
            <Paginator
                invertedColors
                totalHits={artists.total}
                currentPage={currentPage}
                onChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
            />
        }
        </div>
    );
};