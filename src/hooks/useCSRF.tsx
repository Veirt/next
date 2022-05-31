import Authentication from "../utils/Authentication";

function useCSRF() {
  return { _csrf: Authentication.getCSRFToken() }
}

export default useCSRF;
