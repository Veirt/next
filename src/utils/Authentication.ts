import Cookies from "universal-cookie";
import axios from 'axios';

const cookies = new Cookies();

const isServerRequest = typeof window === "undefined";

const getAccessToken = () => {
    if (isServerRequest) return '';

    const accessToken = localStorage?.getItem('playerToken') || cookies.get('playerToken');
    if (accessToken) 
        return accessToken;
    
    return null;
}

const updateAccessToken = (token: string) => {
    if (isServerRequest) return '';

    console.log('Called updateAccessToken: ', token.substring(-5, 5));
    axios.defaults.headers.common['X-Authentication-Token'] = token;
    localStorage?.setItem('playerToken', token);
}

const getCSRFToken = () => {
    if (isServerRequest) return '';

    const accessToken = localStorage?.getItem('_csrf') || cookies.get('_csrf');
    if (accessToken) 
        return accessToken;
    
    return null;
}

const updateCSRFToken = (token: string) => {
    if (isServerRequest) return '';
    
    console.log('Called updateCSRFToken: ', token.substring(-5, 5));
    axios.defaults.headers.common['X-CSRF-Token'] = token;
    localStorage.setItem('_csrf', token);
}

// eslint-disable-next-line
export default { getAccessToken, updateAccessToken, getCSRFToken, updateCSRFToken };