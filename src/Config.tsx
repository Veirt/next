export const toggleStaging = false;

const config = {
    versionControl: "2.1.0",
    name: 'Keymash',
    slogan: 'Take your typing to the next level',
    defaultIcon: '/extras/avatar.jpg',
    defaultImage: '/extras/banner.jpg',
    webUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : toggleStaging ? 'https://staging.Keymash' : 'https://keymash.io',
    apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api/v2' : toggleStaging ? 'https://apistaging.Keymash/api/v2' : 'https://api.Keymash/api/v2',
    authUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/auth/v2' : toggleStaging ? 'https://apistaging.Keymash/auth/v2' : 'https://api.Keymash/auth/v2',
    gameUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/data' : toggleStaging ? 'https://apistaging.Keymash/data' : 'https://api.Keymash/data',
    oauthUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/auth/v2' : toggleStaging ? 'https://apistaging.Keymash/auth/v2' : 'https://api.Keymash/auth/v2',
    cookieUrl: process.env.NODE_ENV === 'development' ? 'localhost' : '.Keymash',
    gameServer:
        process.env.NODE_ENV === 'development'
            ? { URL: 'http://localhost', Port: 2095, }
            : { URL: toggleStaging ? 'https://wsstaging.Keymash' : 'https://us-east.Keymash', Port: null, },
};

export default config;
