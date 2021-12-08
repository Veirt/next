import Cookie, { CookieSetOptions } from 'universal-cookie';

const cookie = new Cookie();

class CookieService {
  get(key: string) {
    return cookie.get(key);
  }

  set(key: string, value: string, expiry?: CookieSetOptions) {
    cookie.set(key, value, expiry || {});
  }

  remove(key: string) {
    cookie.remove(key);
  }
}

export default new CookieService();
