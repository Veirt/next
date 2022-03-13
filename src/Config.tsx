export const toggleStaging = false;

const config = {
    versionControl: "3.0.0",
    name: 'Keymash',
    slogan: 'Take your typing to the next level',
    defaultIcon: '/extras/avatar.jpg',
    defaultImage: '/extras/banner.jpg',
    webUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : toggleStaging ? 'https://staging.keymash.io' : 'https://dev.keymash.io',
    apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8081/api/v2' : toggleStaging ? 'https://apistaging.keymash.io/api/v2' : 'https://api.keymash.io/api/v2',
    authUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8081/auth/v2' : toggleStaging ? 'https://apistaging.keymash.io/auth/v2' : 'https://api.keymash.io/auth/v2',
    gameUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8081/data' : toggleStaging ? 'https://apistaging.keymash.io/data' : 'https://api.keymash.io/data',
    oauthUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8081/auth/v2' : toggleStaging ? 'https://apistaging.keymash.io/auth/v2' : 'https://api.keymash.io/auth/v2',
    cookieUrl: process.env.NODE_ENV === 'development' ? 'localhost' : '.keymash.io',
    gameServer:
        process.env.NODE_ENV === 'development'
            ? { URL: 'http://localhost', Port: 2096, }
            : { URL: toggleStaging ? 'https://wsstaging.keymash.io' : 'https://us-east.keymash.io', Port: null, },
};

export default config;
