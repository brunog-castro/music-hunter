import SearchBar from '../search-bar';
import { Link } from 'react-router-dom';
import { useSidebar } from '../../stores/sidebarStore';

import './styles.scss';

export default function Header() {
    const sidebar = useSidebar();
    const sidebarState = sidebar.getState();

    const isInvertedSidebarOpen = () => {
        return sidebarState.opened && sidebarState.data?.type !== "track";
    };

    return (
        <header id="header">
            <Link 
                to="/" 
                className={
                    "logo" + 
                    (isInvertedSidebarOpen() ? " inverted" : "")
                }
            >
                <span>MusicHunter</span>
            </Link>
            <SearchBar />
        </header>
    );
}