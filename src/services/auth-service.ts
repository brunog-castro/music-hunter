import { Buffer } from "buffer";
import UserStorage from "../utils/userStorage";

export default class AuthService {
    static async init(): Promise<boolean> {
        const buffer = Buffer.from(
            `${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`
        );
        
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${buffer.toString('base64')}`);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        const config: RequestInit = {
            mode: "cors",
            method: 'POST',
            headers: myHeaders,
            body: "grant_type=client_credentials",
        };

        const accessToken = await fetch(
            process.env.REACT_APP_SPOTIFY_ACCOUNTS_BASE_URL + "token", 
            config
        ).then(async (response) => {
            const result = await response.json();
            if (result.error) {
                throw new Error(
                    "Couldn't authenticate with Spotify's API. " +
                    "Please, refresh the page and try again"
                );
            }
            
            return result.access_token;
        });

        if (!accessToken)
            return false;

        UserStorage.setToken(accessToken);
        return true;
    }
}