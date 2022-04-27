const path = require('path');

module.exports = {
  i18n: {
    localeDetection: false,
    defaultLocale: 'en',
    locales: ['en', 'fr-FR', 'es-MX', 'pt-BR', 'de-DE', 'no', 'hr', 'nl', 'it-IT', 'ar', 'el-GR', 'zh-Hans-CN'],
    debug: process.env.NODE_ENV === 'development',
    defaultNS: `translation`,
    localePath: path.resolve('./public/locales'),
  },
  react: { useSuspense: false },
};
