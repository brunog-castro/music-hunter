import AuthService from "./auth-service";
import UserStorage from "../utils/userStorage";
import { SearchResult } from "../models/search-result/search-result";
import { PaginationConfig } from "../models/pagination/pagination-config";

export enum SearchInOptions {
    All = "All",
    Track = "Track",
    Album = "Album",
    Artist = "Artist",
}

export default class SearchService {
    static async search(
        query: string, 
        searchIn: SearchInOptions = SearchInOptions.All,
        pagination?: PaginationConfig
    ): Promise<SearchResult> {
        const accessToken = UserStorage.getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        
        const config: RequestInit = {
            mode: "cors",
            method: 'GET',
            headers: myHeaders,
        };

        let searchInParams = "track%2Cartist%2Calbum";
        if (searchIn !== SearchInOptions.All)
            searchInParams = searchIn.toString().toLowerCase();

        let params = `q=${query}&type=${searchInParams}`;
        if (pagination) {
            if (pagination.limit)
                params += `&limit=${pagination.limit}`;
            if (pagination.offset)
                params += `&offset=${pagination.offset}`;
        }

        return fetch(
            `${process.env.REACT_APP_SPOTIFY_BASE_URL}search?${params}`, 
            config
        )
            .then(async (response: any) => {
                const result = await response.json();
                if (result.error?.status === 401) {
                    if (await AuthService.init())
                        return SearchService.search(query, searchIn);
                    else
                        throw new Error("Invalid response");
                }

                return result;
            });
    }
}