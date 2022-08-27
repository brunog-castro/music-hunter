import AlbumTab from './tabs/album';
import TracksTab from './tabs/track';
import ArtistTab from './tabs/artist';
import { useEffect, useState } from 'react';
import MainTemplate from '../templates/main';
import { useSearchParams } from 'react-router-dom';

import "./styles.scss";

export default function SearchResultsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedTab, setSelectedTab] = useState<string>("track");
    const [query, setQuery] = useState<string>(searchParams.get("query") || "");

    useEffect(() => {
        const queryText = searchParams.get("query");
        if (queryText && queryText !== query)
            setQuery(queryText);

        const queryType = searchParams.get("type");
        if (!queryType || queryType === "all")
            setSelectedTab("track");
        else
            setSelectedTab(queryType);
        //eslint-disable-next-line
    }, [searchParams]);

    const updateParamsFor = (type: string) => {
        searchParams.set("type", type);
        setSearchParams(searchParams);
    };

    return (
        <MainTemplate>
            <div id="search-page">
                <div className="tabs">
                    <button
                        title="Tracks"
                        onClick={() => updateParamsFor("track")}
                        className={
                            "track" +
                            (selectedTab === "track" ? " active" : "")
                        }
                    >
                        <span className="mobile-only">Tracks</span>
                    </button>
                    <button
                        title="Artists"
                        onClick={() => updateParamsFor("artist")}
                        className={
                            "artist" +
                            (selectedTab === "artist" ? " active" : "")
                        }
                    >
                        <span className="mobile-only">Artists</span>
                    </button>
                    <button
                        title="Albums"
                        onClick={() => updateParamsFor("album")}
                        className={
                            "album" +
                            (selectedTab === "album" ? " active" : "")
                        }
                    >
                        <span className="mobile-only">Albums</span>
                    </button>
                </div>
                <div className="tab-content">
                    {selectedTab === "album" && <AlbumTab searchTerm={query} />}
                    {selectedTab === "track" && <TracksTab searchTerm={query} />}
                    {selectedTab === "artist" && <ArtistTab searchTerm={query} />}
                </div>
            </div>
        </MainTemplate>
    );
}