import CookieService from './CookieService';

class DebugService {
    add(str: string) {
        let storageJSON = [];
        const getStorage = localStorage.getItem('debugLog');

        if (getStorage)
            storageJSON = JSON.parse(getStorage);

        storageJSON.push(`${new Date().getTime() / 1000}: ${str}`);
        localStorage.setItem('debugLog', JSON.stringify(storageJSON));
        return console.log(str);
    }

    get() {
        const getStorage = localStorage.getItem('debugLog');
        if (getStorage)
            return JSON.parse(getStorage);
        else
            return [];
    }

    clear() {
        if (CookieService.get('debugLog'))
            CookieService.set('debugLog', '{}', { path: '/' });

        localStorage.removeItem('debugLog');
        return true;
    }
}

export default new DebugService();
