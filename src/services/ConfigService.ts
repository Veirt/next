import Cookie from 'universal-cookie';

interface ConfigData {
  locale: string;
  world: number;
  smoothCaret: '0' | '1';
  smoothCaretSpeed: string;
  hideInputBox: '0' | '1';
  gameplayParticipantStyle: '0' | '1';
  upscaleMatch: '0' | '1';
  upscaleMatchContainer: '0' | '1';
  countdownBeep: '0' | '1';
  rankUpSound: '0' | '1';
  rankDownSound: '0' | '1';
  customChatBeep: '0' | '1';
  globalChatBeep: '0' | '1';
  matchFinishBeep: '0' | '1';
  matchContainerTransparent: '0' | '1';
  matchTextType: '0' | '1';
  performanceMode: '0' | '1';
  colorBlindMode: '0' | '1';
  shortcutGameRedo: string;
}

class ConfigService extends Cookie {
  private readonly defaultJSON: ConfigData = {
    world: 0,
    locale: 'en',
    smoothCaret: '1',
    smoothCaretSpeed: '100',
    hideInputBox: '0',
    gameplayParticipantStyle: '0',
    upscaleMatch: '0',
    upscaleMatchContainer: '0',
    countdownBeep: '1',
    rankUpSound: '1',
    rankDownSound: '1',
    customChatBeep: '1',
    globalChatBeep: '1',
    matchFinishBeep: '1',
    matchContainerTransparent: '0',
    matchTextType: '1',
    performanceMode: '0',
    shortcutGameRedo: 'CTRL+ALT+B',
    colorBlindMode: '0'
  };

  public storageJSON: ConfigData = this.get('useConfig');

  getColorBlindMode() {
    if (this.storageJSON && this.storageJSON.colorBlindMode) return this.storageJSON.colorBlindMode;
    return this.defaultJSON.colorBlindMode;
  }

  getMatchContainerTransparent() {
    if (this.storageJSON && this.storageJSON.matchContainerTransparent) return this.storageJSON.matchContainerTransparent;
    return this.defaultJSON.matchContainerTransparent;
  }

  getMatchTextType() {
    if (this.storageJSON && this.storageJSON.matchTextType) return this.storageJSON.matchTextType;
    return this.defaultJSON.matchTextType;
  }

  getWorld() {
    if (this.storageJSON && this.storageJSON.world) return this.storageJSON.world;
    return this.defaultJSON.world;
  }

  getLocale() {
    if (this.storageJSON && this.storageJSON.locale) return this.storageJSON.locale;
    return this.defaultJSON.locale;
  }

  getShortcutGameRedo() {
    if (this.storageJSON && this.storageJSON.shortcutGameRedo) return this.storageJSON.shortcutGameRedo;
    return this.defaultJSON.shortcutGameRedo;
  }

  getSmoothCaret() {
    if (this.storageJSON && this.storageJSON.smoothCaret) return this.storageJSON.smoothCaret;
    return this.defaultJSON.smoothCaret;
  }

  getSmoothCaretSpeed() {
    if (this.storageJSON && this.storageJSON.smoothCaretSpeed) return this.storageJSON.smoothCaretSpeed;
    return this.defaultJSON.smoothCaretSpeed;
  }

  getHideInputBox() {
    if (this.storageJSON && this.storageJSON.hideInputBox) return this.storageJSON.hideInputBox;
    return this.defaultJSON.hideInputBox;
  }

  getGameplayParticipantStyle() {
    if (this.storageJSON && this.storageJSON.gameplayParticipantStyle) return this.storageJSON.gameplayParticipantStyle;
    return this.defaultJSON.gameplayParticipantStyle;
  }

  getUpscaleMatch() {
    if (this.storageJSON && this.storageJSON.upscaleMatch) return this.storageJSON.upscaleMatch;
    return this.defaultJSON.upscaleMatch;
  }

  getUpscaleMatchContainer() {
    if (this.storageJSON && this.storageJSON.upscaleMatchContainer) return this.storageJSON.upscaleMatchContainer;
    return this.defaultJSON.upscaleMatchContainer;
  }

  getCountdownBeep() {
    if (this.storageJSON && this.storageJSON.countdownBeep) return this.storageJSON.countdownBeep;
    return this.defaultJSON.countdownBeep;
  }

  getRankUpSound() {
    if (this.storageJSON && this.storageJSON.rankUpSound) return this.storageJSON.rankUpSound;
    return this.defaultJSON.rankUpSound;
  }

  getRankDownSound() {
    if (this.storageJSON && this.storageJSON.rankDownSound) return this.storageJSON.rankDownSound;
    return this.defaultJSON.rankDownSound;
  }

  getGlobalChatBeep() {
    if (this.storageJSON && this.storageJSON.globalChatBeep) return this.storageJSON.globalChatBeep;
    return this.defaultJSON.globalChatBeep;
  }

  getCustomChatBeep() {
    if (this.storageJSON && this.storageJSON.customChatBeep) return this.storageJSON.customChatBeep;
    return this.defaultJSON.customChatBeep;
  }

  getMatchFinishBeep() {
    if (this.storageJSON && this.storageJSON.matchFinishBeep) return this.storageJSON.matchFinishBeep;
    return this.defaultJSON.matchFinishBeep;
  }

  getPerformanceMode() {
    if (this.storageJSON && this.storageJSON.performanceMode) return this.storageJSON.performanceMode;
    return this.defaultJSON.performanceMode;
  }

  parseServerSideConfig(cookieString: string) {
      const cookieData = cookieString.split('; ');
      let config: ConfigData = {} as ConfigData;
      cookieData.forEach(item => {
        const [key, value] = item.split('=');
        if (key === 'useConfig' && value && value !== 'undefined')
          config = JSON.parse(value as string);
      });
      return config;
  }

  getServerSideOption(key: string, cookieString: string) {
      const config = this.parseServerSideConfig(cookieString);
      // @ts-ignore
      return config[key] || this.defaultJSON[key];
  }
}

export default new ConfigService();
