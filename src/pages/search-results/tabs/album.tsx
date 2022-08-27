import { useEffect, useState } from "react";
import Loader from "../../../components/loader";
import { Album } from "../../../models/album/album";
import Paginator from "../../../components/paginator";
import { useSidebar } from "../../../stores/sidebarStore";
import { Result } from "../../../models/search-result/search-result";
import SearchService, { SearchInOptions } from "../../../services/search-service";
import SearchBarResultsItem from "../../../components/search-bar/search-bar-results/item";

import "./styles.scss";

interface PropTypes {
    searchTerm: string;
}

export default function AlbumTab(props: PropTypes) {
    const itemsPerPage = 10;
    const sidebar = useSidebar();

    const [albums, setAlbums] = useState<Result<Album>>();
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);

    useEffect(() => {
        setLoading(true);
        SearchService.search(
            props.searchTerm, 
            SearchInOptions.Album,
            { 
                limit: itemsPerPage,
                offset: currentPage * itemsPerPage,
            }
        )
            .then(result => {
                setAlbums(result.albums);
                setLoading(false);
            })
    }, [props.searchTerm, currentPage]);

    const onItemClick = (item: Album) => {
        sidebar.setState({
            data: item,
            opened: true,
        });
    };

    return (
        <div id="albums-tab" className="tab">
            <div className="result-header albums">
                <span className="title">Albums</span>
                <div className="subtext">
                    {albums?.total || "0"} results for "{props.searchTerm}"
                </div>
            </div>
        {loading && !albums ? 
            <Loader inverted />
        :
            (!albums || albums.items.length < 0 ?
                <div>No results found</div>
                :
                <>
                {loading && <Loader className="inner-loader" inverted />}
                <div className="list albums">
                    {albums.items.map(album =>
                        <SearchBarResultsItem
                            key={album.id}
                            title={album.name}
                            onClick={() => onItemClick(album)}
                            thumbnail={album?.images?.[0]?.url}
                            subtitle={album.artists?.map(a => a.name).join(", ")}
                        />
                    )}
                </div>
                </> 
            )
        }
        {albums && 
            <Paginator
                invertedColors
                totalHits={albums.total}
                currentPage={currentPage}
                onChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
            />
        }
        </div>
    );
};