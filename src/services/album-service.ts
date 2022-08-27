import AuthService from "./auth-service";
import { Album } from "../models/album/album";
import UserStorage from "../utils/userStorage";
import { Result } from "../models/search-result/search-result";

export enum SearchInOptions {
    All = "All",
    Track = "Track",
    Album = "Album",
    Artist = "Artist",
}

export default class AlbumService {
    static async getAlbum(id: string): Promise<Album> {
        const accessToken = UserStorage.getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        
        const config: RequestInit = {
            mode: "cors",
            method: 'GET',
            headers: myHeaders,
        };

        return fetch(
            `${process.env.REACT_APP_SPOTIFY_BASE_URL}albums/${id}`,
            config
        )
            .then(async (response: any) => {
                const result = await response.json();
                if (result.error) {
                    if (result.error.status === 401) {
                        await AuthService.init();
                        return AlbumService.getAlbum(id);
                    } else {
                        throw new Error("Unknown error");
                    }
                }

                return result;
            });
    }

    static async getAlbumsFrom(artistId: string): Promise<Result<Album>> {
        const accessToken = UserStorage.getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        
        const config: RequestInit = {
            mode: "cors",
            method: 'GET',
            headers: myHeaders,
        };

        return fetch(
            `${process.env.REACT_APP_SPOTIFY_BASE_URL}artists/${artistId}/albums`,
            config
        )
            .then(async (response: any) => {
                const result = await response.json();
                if (result.error) {
                    if (result.error.status === 401) {
                        await AuthService.init();
                        return AlbumService.getAlbumsFrom(artistId);
                    } else {
                        throw new Error("Unknown error");
                    }
                }

                return result;
            });
    }
}