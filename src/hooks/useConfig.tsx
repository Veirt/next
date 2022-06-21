import Cookies from 'universal-cookie';

export interface ConfigData {
  dev: '0' | '1';
  locale: string;
  queueLocale: string;
  useCPM: '0' | '1';
  smoothCaret: '0' | '1';
  smoothCaretSpeed: string;
  hideInputBox: '0' | '1';
  gameplayParticipantStyle: '0' | '1' | '2';
  upscaleMatch: '0' | '1';
  upscaleMatchContainer: '0' | '1';
  streamerMode: '0' | '1';
  hideWPM: '0' | '1';
  countdownBeep: '0' | '1';
  rankUpSound: '0' | '1';
  rankDownSound: '0' | '1';
  customChatBeep: '0' | '1';
  globalChatBeep: '0' | '1';
  matchFinishBeep: '0' | '1';
  matchContainerTransparent: '0' | '1';
  matchTextType: '0' | '1';
  focusMode: '0' | '1';
  matchTextScroll: '0' | '1';
  performanceMode: '0' | '1';
  colorBlindMode: '0' | '1';
  adsGameplay: '0' | '1';
  rightToLeft: '0' | '1';
  networkStrength: '0' | '1' | '2';
  shortcutHome: string;
  shortcutExit: string;
  shortcutPlayRandom: string;
  shortcutPlayQuotes: string;
  shortcutPlayDictionary: string;
  shortcutGameRedo: string;
}

function useConfig() {
  const cookies = new Cookies();
  const storageJSON: ConfigData = cookies.get('useConfig') || {};
  const defaultJSON: ConfigData = {
    dev: process.env.NODE_ENV === 'development' ? '1' : '0',
    locale: 'en',
    queueLocale: 'en',
    useCPM: '0',
    smoothCaret: '1',
    smoothCaretSpeed: '100',
    hideInputBox: '0',
    gameplayParticipantStyle: '0',
    upscaleMatch: '1',
    upscaleMatchContainer: '0',
    streamerMode: '0',
    hideWPM: '0',
    countdownBeep: '1',
    rankUpSound: '1',
    rankDownSound: '1',
    customChatBeep: '1',
    globalChatBeep: '1',
    matchFinishBeep: '1',
    matchContainerTransparent: '0',
    matchTextType: '1',
    matchTextScroll: '1',
    focusMode: '0',
    performanceMode: '0',
    networkStrength: '1',
    rightToLeft: '0',
    shortcutHome: 'CTRL+ALT+H',
    shortcutExit: 'CTRL+ALT+E',
    shortcutPlayRandom: 'CTRL+ALT+G',
    shortcutPlayQuotes: 'CTRL+ALT+Q',
    shortcutPlayDictionary: 'CTRL+ALT+D',
    shortcutGameRedo: 'CTRL+ALT+B',
    colorBlindMode: '0',
    adsGameplay: '1',
  };

  const setOption = (item: string, value: string) => {
    // @ts-ignore
    const useValue = storageJSON && typeof storageJSON[item] !== 'undefined' ? storageJSON[item] : defaultJSON[item];
    // @ts-ignore
    storageJSON[item] = value || useValue;
    cookies.set('useConfig', storageJSON);
  };

  const returnConfig = {
    locale: storageJSON && typeof storageJSON.locale !== 'undefined' ? storageJSON.locale : defaultJSON.locale,
    queueLocale: storageJSON && typeof storageJSON.queueLocale !== 'undefined' ? storageJSON.queueLocale : defaultJSON.queueLocale,
    useCPM: storageJSON && typeof storageJSON.useCPM !== 'undefined' ? storageJSON.useCPM : defaultJSON.useCPM,
    smoothCaret: storageJSON && typeof storageJSON.smoothCaret !== 'undefined' ? storageJSON.smoothCaret : defaultJSON.smoothCaret,
    smoothCaretSpeed: storageJSON && typeof storageJSON.smoothCaretSpeed !== 'undefined' ? storageJSON.smoothCaretSpeed : defaultJSON.smoothCaretSpeed,
    hideInputBox: storageJSON && typeof storageJSON.hideInputBox !== 'undefined' ? storageJSON.hideInputBox : defaultJSON.hideInputBox,
    gameplayParticipantStyle: storageJSON && typeof storageJSON.gameplayParticipantStyle !== 'undefined' ? storageJSON.gameplayParticipantStyle : defaultJSON.gameplayParticipantStyle,
    upscaleMatch: storageJSON && typeof storageJSON.upscaleMatch !== 'undefined' ? storageJSON.upscaleMatch : defaultJSON.upscaleMatch,
    upscaleMatchContainer: storageJSON && typeof storageJSON.upscaleMatchContainer !== 'undefined' ? storageJSON.upscaleMatchContainer : defaultJSON.upscaleMatchContainer,
    streamerMode: storageJSON && typeof storageJSON.streamerMode !== 'undefined' ? storageJSON.streamerMode : defaultJSON.streamerMode,
    hideWPM: storageJSON && typeof storageJSON.hideWPM !== 'undefined' ? storageJSON.hideWPM : defaultJSON.hideWPM,
    countdownBeep: storageJSON && typeof storageJSON.countdownBeep !== 'undefined' ? storageJSON.countdownBeep : defaultJSON.countdownBeep,
    rankUpSound: storageJSON && typeof storageJSON.rankUpSound !== 'undefined' ? storageJSON.rankUpSound : defaultJSON.rankUpSound,
    rankDownSound: storageJSON && typeof storageJSON.rankDownSound !== 'undefined' ? storageJSON.rankDownSound : defaultJSON.rankDownSound,
    customChatBeep: storageJSON && typeof storageJSON.customChatBeep !== 'undefined' ? storageJSON.customChatBeep : defaultJSON.customChatBeep,
    globalChatBeep: storageJSON && typeof storageJSON.globalChatBeep !== 'undefined' ? storageJSON.globalChatBeep : defaultJSON.globalChatBeep,
    matchFinishBeep: storageJSON && typeof storageJSON.matchFinishBeep !== 'undefined' ? storageJSON.matchFinishBeep : defaultJSON.matchFinishBeep,
    matchContainerTransparent: storageJSON && typeof storageJSON.matchContainerTransparent !== 'undefined' ? storageJSON.matchContainerTransparent : defaultJSON.matchContainerTransparent,
    matchTextType: storageJSON && typeof storageJSON.matchTextType !== 'undefined' ? storageJSON.matchTextType : defaultJSON.matchTextType,
    matchTextScroll: storageJSON && typeof storageJSON.matchTextScroll !== 'undefined' ? storageJSON.matchTextScroll : defaultJSON.matchTextScroll,
    focusMode: storageJSON && typeof storageJSON.focusMode !== 'undefined' ? storageJSON.focusMode : defaultJSON.focusMode,
    performanceMode: storageJSON && typeof storageJSON.performanceMode !== 'undefined' ? storageJSON.performanceMode : defaultJSON.performanceMode,
    colorBlindMode: storageJSON && typeof storageJSON.colorBlindMode !== 'undefined' ? storageJSON.colorBlindMode : defaultJSON.colorBlindMode,
    adsGameplay: storageJSON && typeof storageJSON.adsGameplay !== 'undefined' ? storageJSON.adsGameplay : defaultJSON.adsGameplay,
    networkStrength: storageJSON && typeof storageJSON.networkStrength !== 'undefined' ? storageJSON.networkStrength : defaultJSON.networkStrength,
    shortcutHome: storageJSON && typeof storageJSON.shortcutHome !== 'undefined' ? storageJSON.shortcutHome : defaultJSON.shortcutHome,
    shortcutExit: storageJSON && typeof storageJSON.shortcutExit !== 'undefined' ? storageJSON.shortcutExit : defaultJSON.shortcutExit,
    shortcutPlayRandom: storageJSON && typeof storageJSON.shortcutPlayRandom !== 'undefined' ? storageJSON.shortcutPlayRandom : defaultJSON.shortcutPlayRandom,
    shortcutPlayQuotes: storageJSON && typeof storageJSON.shortcutPlayQuotes !== 'undefined' ? storageJSON.shortcutPlayQuotes : defaultJSON.shortcutPlayQuotes,
    shortcutPlayDictionary: storageJSON && typeof storageJSON.shortcutPlayDictionary !== 'undefined' ? storageJSON.shortcutPlayDictionary : defaultJSON.shortcutPlayDictionary,
    shortcutGameRedo: storageJSON && typeof storageJSON.shortcutGameRedo !== 'undefined' ? storageJSON.shortcutGameRedo : defaultJSON.shortcutGameRedo,
    rightToLeft: storageJSON && typeof storageJSON.rightToLeft !== 'undefined' ? storageJSON.rightToLeft : defaultJSON.rightToLeft,
  };

  return {
    setOption,
    fullConfig: { ...returnConfig } as ConfigData,
    ...returnConfig,
  };
}

export default useConfig;
