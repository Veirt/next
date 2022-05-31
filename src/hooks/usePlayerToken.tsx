import Authentication from '../utils/Authentication';

function usePlayerToken() {
  return { playerToken: Authentication.getAccessToken() }
}

export default usePlayerToken;
