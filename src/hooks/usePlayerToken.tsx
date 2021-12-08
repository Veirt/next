import Cookies from 'universal-cookie';

function usePlayerToken() {
    const cookies = new Cookies();
    return { playerToken: cookies.get('playerToken') }
}

export default usePlayerToken;