const storageKey = "@music-hunter-at";

class UserStorage { 
    static hasToken = ():boolean => { 
        var token = localStorage.getItem(storageKey);
        return !!token;
    };

    static getToken = ():string => {
        const token = localStorage.getItem(storageKey);
        return token || "";
    };

    static setToken = (userToken:string):void => {
        localStorage.setItem(storageKey, userToken);
    };
}

export default UserStorage;