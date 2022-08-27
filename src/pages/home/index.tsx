import MainTemplate from '../templates/main';
import { useSidebar } from '../../stores/sidebarStore';
import AlbumService from '../../services/album-service';

import "./styles.scss";

export default function HomePage() {
    const sidebar = useSidebar();

    const openRandomAlbum = () => {
        AlbumService.getAlbum("0jIGcf2ycn8eLfXhD3J5Ny")
            .then(album => {
                sidebar.setState({
                    data: album,
                    opened: true,
                });
            });
    };

    return (
        <MainTemplate>
            <div id="home-page">
                <button onClick={openRandomAlbum}>
                    Take me to a random album title
                </button>
            </div>
        </MainTemplate>
    );
}