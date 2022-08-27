import SearchBar from '../search-bar';
import { Link } from 'react-router-dom';

import logoImage from '../../assets/logo.png';
import './styles.scss';

export default function Header() {
    return (
        <header id="header">
            <Link to="/" className="logo">
                <img src={logoImage} alt="logo" />
                <span>MusicHunter</span>
            </Link>
            <SearchBar />
        </header>
    );
}