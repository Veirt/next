export const toggleStaging = false;

const config = {
    versionControl: "2.1.0",
    name: 'Keyma.sh',
    slogan: 'Take your typing to the next level',
    defaultIcon: '/extras/avatar.jpg',
    defaultImage: '/extras/banner.jpg',
    webUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : toggleStaging ? 'https://staging.keyma.sh' : 'https://keyma.sh',
    apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api/v2' : toggleStaging ? 'https://apistaging.keyma.sh/api/v2' : 'https://api.keyma.sh/api/v2',
    authUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/auth/v2' : toggleStaging ? 'https://apistaging.keyma.sh/auth/v2' : 'https://api.keyma.sh/auth/v2',
    gameUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/data' : toggleStaging ? 'https://apistaging.keyma.sh/data' : 'https://api.keyma.sh/data',
    oauthUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/auth/v2' : toggleStaging ? 'https://apistaging.keyma.sh/auth/v2' : 'https://api.keyma.sh/auth/v2',
    cookieUrl: process.env.NODE_ENV === 'development' ? 'localhost' : '.keyma.sh',
    gameServer:
        process.env.NODE_ENV === 'development'
            ? { URL: 'http://localhost', Port: 2095, }
            : { URL: toggleStaging ? 'https://wsstaging.keyma.sh' : 'https://us-east.keyma.sh', Port: null, },
};

export default config;
