
export class LoginUtil {
    static storageUrl: string = 'u';
    static storageKey: string = 'k';

    constructor() {}

    public static addToStorage(apiUrl: string, apiKey: string) {
        localStorage.setItem(LoginUtil.storageUrl, apiUrl);
        localStorage.setItem(LoginUtil.storageKey, apiKey);
    }
    
    public static retrieveUrl() {
        return localStorage.getItem(LoginUtil.storageUrl) || '';
    }

    public static retrieveKey() {
        return localStorage.getItem(LoginUtil.storageKey) || '';
    }

    public static clearStorage() {
        localStorage.removeItem(LoginUtil.storageUrl);
        localStorage.removeItem(LoginUtil.storageKey);
    }
}

