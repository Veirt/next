import Cookie from 'universal-cookie';

interface ConfigData {
  locale: string;
  playerToken: string;
}

class ConfigService extends Cookie {
  private readonly defaultJSON: ConfigData = {
    locale: 'en',
    playerToken: '',
  };

  public storageJSON: ConfigData = this.get('useConfig');

  parseServerSideConfig(cookieString: string) {
    const cookieData = cookieString.split('; ');
    let config: ConfigData = {} as ConfigData;
    cookieData.forEach((item) => {
      const [key, value] = item.split('=');
      if (key === 'useConfig' && value && value !== 'undefined') {
        try {
          config = JSON.parse(value);
          return config;
        } catch {
          return false;
        }
      }
      return null;
    });
    return config;
  }

  getServerSideOption(key: string, cookieString: string) {
    const config = this.parseServerSideConfig(cookieString);
    // @ts-ignore
    return config && config[key] ? config[key] : this.defaultJSON[key];
  }
}

export default new ConfigService();
