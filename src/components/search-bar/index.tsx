import useDebounce from '../../utils/debounce';
import { Album } from '../../models/album/album';
import { Track } from '../../models/track/track';
import { Artist } from '../../models/artist/artist';
import SearchBarResults from './search-bar-results';
import { useSidebar } from '../../stores/sidebarStore';
import SearchService from '../../services/search-service';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Result } from '../../models/search-result/search-result';

import './styles.scss';

export default function SearchBar() {
    const sidebar = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();

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
    const [query, setQuery] = useState<string>(searchParams.get("query") || "");
    const [viewMode, setViewMode] = useState<"docked" | "centered">("centered");
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
        if (!query)
            return;

        debouncedFilter(query);
        // eslint-disable-next-line
    }, [query]);

    const debouncedFilter = useDebounce((text: any) => {
        if (!text) {
            setShowDropdown(false);
            return;
        }

        setShowDropdown(true);
        console.log("debouncedFilter", "dropdown true");
       SearchService.search(text)
        .then(results => {
            setTrackResults(results.tracks);
            setAlbumResults(results.albums);
            setArtistResults(results.artists);
        });
    }, 400);

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
                placeholder="Search for tracks, artists or albums..."
                onChange={(evt: any) => setQuery(evt.target.value)} 
            />
            <button className="submit-search" title="Search" />
            <div className="dropdown-container" hidden={!showDropdown}>
                <SearchBarResults 
                    albumResults={albumResults}
                    trackResults={trackResults}
                    artistResults={artistResults}
                    onItemClick={onSearchItemClick}
                    selectedSearchType={selectedType}
                />
                <button className="submit-btn">
                    See all results
                </button>
            </div>
        </form>
    );
}