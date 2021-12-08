import Cookies from 'universal-cookie';

function useCSRF() {
    const cookies = new Cookies();
    return { _csrf: cookies.get('_csrf') }
}

export default useCSRF;