import useDebounce from '../../utils/debounce';
import { Album } from '../../models/album/album';
import { Track } from '../../models/track/track';
import { useFlash } from '../../stores/flashStore';
import { Artist } from '../../models/artist/artist';
import SearchBarResults from './search-bar-results';
import { useSidebar } from '../../stores/sidebarStore';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Result } from '../../models/search-result/search-result';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SearchService, { SearchInOptions } from '../../services/search-service';

import './styles.scss';

export default function SearchBar() {
    const flash = useFlash();
    const sidebar = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();

    const barRef: RefObject<HTMLFormElement> = useRef(null);
    const typesRef: RefObject<HTMLDivElement> = useRef(null);
    const availableTypes = [ "all", "track", "artist", "album" ];
    
    const [searchParams] = useSearchParams();
    const [inputFocused, setInputFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState<boolean>();
    const [trackResults, setTrackResults] = useState<Result<Track>>();
    const [albumResults, setAlbumResults] = useState<Result<Album>>();
    const [artistResults, setArtistResults] = useState<Result<Artist>>();
    const [showTypesDropdown, setShowTypesDropdown] = useState<boolean>();
    const [localSearchActive, setLocalSearchActive] = useState<boolean>();
    const [query, setQuery] = useState<string>(searchParams.get("query") || "");
    const [viewMode, setViewMode] = useState<"docked" | "centered">("centered");
    const [localTrackResults, setLocalTrackResults] = useState<Result<Track>>();
    const [localAlbumResults, setLocalAlbumResults] = useState<Result<Album>>();
    const [localArtistResults, setLocalArtistResults] = useState<Result<Artist>>();
    const [selectedType, setSelectedType] = 
        useState<string>(searchParams.get("type") || availableTypes[0]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    useEffect(() => {
        if (!inputFocused)
            return;

        debouncedFilter(query);
        // eslint-disable-next-line
    }, [inputFocused]);

    useEffect(() => {
        setTimeout(() => setShowDropdown(false), 401);

        switch (location.pathname) {
            case "/":
                setViewMode("centered");
                break;
            case "/search":
                setViewMode("docked");
                break;
            default:
                break;
        }
    }, [location]);

    useEffect(() => {
        if (!query) {
            setShowDropdown(false);
            return;
        }

        runLocalSearch();
        if (!trackResults && !albumResults && !artistResults)
            runSearch(query);
        else
            debouncedFilter(query);
        // eslint-disable-next-line
    }, [query]);

    const debouncedFilter = useDebounce((searchTerm: any) => {
        runSearch(searchTerm);
    }, 400);

    const runLocalSearch = () => {
        setLocalSearchActive(true);
        runLocalTrackSearch();
        runLocalAlbumSearch();
        runLocalArtistSearch();
    };

    const runSearch = (searchTerm: string) => {
        if (!searchTerm) {
            setShowDropdown(false);
            return;
        }

        setShowDropdown(true);
        SearchService.search(
            searchTerm, 
            getSearchInOption(),
            { limit: 30 }
        )
            .then(results => {
                setLocalSearchActive(false);
                setTrackResults(results.tracks);
                setAlbumResults(results.albums);
                setArtistResults(results.artists);
            })
            .catch(error => {
                flash.show({
                    type: "warning",
                    delayInMs: 4000,
                    message: error.message,
                });
            });
    }

    const runLocalTrackSearch = () => {
        if (!trackResults)
            return undefined;

        const trackResultsCopy = Object.assign({}, trackResults);
        const lowerCaseQuery = query.toLowerCase();
        trackResultsCopy.items = trackResultsCopy.items.filter(t =>
            t.name.toLowerCase().includes(lowerCaseQuery) ||
            t.artists.some(a => a.name.toLowerCase().includes(lowerCaseQuery))
        );
        setLocalTrackResults(trackResultsCopy);
    };

    const runLocalAlbumSearch = () => {
        if (!albumResults)
            return undefined;

        const albumResultsCopy = Object.assign({}, albumResults);
        const lowerCaseQuery = query.toLowerCase();
        albumResultsCopy.items = albumResultsCopy.items.filter(a =>
            a.name.toLowerCase().includes(lowerCaseQuery) ||
            a.artists.some(a => a.name.toLowerCase().includes(lowerCaseQuery))
        );
        setLocalAlbumResults(albumResultsCopy);
    };

    const runLocalArtistSearch = () => {
        if (!artistResults)
            return undefined;

        const artistResultsCopy = Object.assign({}, artistResults);
        const lowerCaseQuery = query.toLowerCase();
        artistResultsCopy.items = artistResultsCopy.items.filter(a =>
            a.name.toLowerCase().includes(lowerCaseQuery)
        );
        setLocalArtistResults(artistResultsCopy);
    };

    const getSearchInOption = (): SearchInOptions => {
        switch (selectedType) {
            case "track":
                return SearchInOptions.Track;
            case "artist":
                return SearchInOptions.Artist;
            case "album":
                return SearchInOptions.Album;
            default:
                return SearchInOptions.All;
        }
    };

    const handleClickOutside = (event: any) => {
        if (barRef.current &&
            !barRef.current.contains(event.target) &&
            showDropdown
        ) {
            setShowDropdown(false);
        }

        if (typesRef.current &&
            !typesRef.current.contains(event.target) &&
            showTypesDropdown
        ) {
            setShowTypesDropdown(false);
        }
    };

    const onSearchItemClick = (item: Album | Artist | Track) => {
        setShowDropdown(false);
        sidebar.setState({
            data: item,
            opened: true,
        });
    };

    const onSubmit = (event?: any) => {
        event?.preventDefault();
        setShowDropdown(false);

        const url = `/search?query=${query}&type=${selectedType}`;     
        navigate(url);
    };

    return (
        <form 
            ref={barRef}
            autoComplete="off"
            onSubmit={onSubmit}
            id="search-container"
            className={
                viewMode +
                (showDropdown ? " search-open" : "") +
                (showTypesDropdown ? " types-open" : "")
            } 
        >
            <div ref={typesRef} className="type-selector">
                <div 
                    className="selected-type" 
                    onClick={() => setShowTypesDropdown(true)}
                >
                    {selectedType} <small>&#9660;</small>
                </div>
                <div className="available-types" hidden={!showTypesDropdown}>
                    {availableTypes.map(type => 
                        <div 
                            key={type} 
                            className="type-option"
                            onClick={() => {
                                setSelectedType(type);
                                setShowTypesDropdown(false);
                            }}
                        >
                            {type}
                        </div>
                    )}
                </div>
            </div>
            <input 
                type="text" 
                value={query} 
                className="input-field"
                onBlur={() => setInputFocused(false)}
                onFocus={() => setInputFocused(true)}
                onChange={(evt: any) => setQuery(evt.target.value)}
                placeholder="Search for tracks, artists or albums..."
            />
            <button className="submit-search" title="Search" />
            <div className="dropdown-container" hidden={!showDropdown}>
                <SearchBarResults
                    onItemClick={onSearchItemClick}
                    selectedSearchType={selectedType}
                    albumResults={
                        localSearchActive ? localAlbumResults : albumResults
                    }
                    trackResults={
                        localSearchActive ? localTrackResults : trackResults
                    }
                    artistResults={
                        localSearchActive ? localArtistResults : artistResults
                    }
                />
                <button className="submit-btn">
                    See all results
                </button>
            </div>
        </form>
    );
}