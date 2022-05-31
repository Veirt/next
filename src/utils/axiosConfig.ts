import axios from 'axios';
import Authentication from './Authentication';

axios.defaults.headers.common['X-Authentication-Token'] = Authentication.getAccessToken();
axios.defaults.headers.common['X-CSRF-Token'] = Authentication.getCSRFToken();
axios.defaults.withCredentials = true;

export default axios;