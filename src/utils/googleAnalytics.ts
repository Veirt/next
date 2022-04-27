import ReactGA from 'react-ga4';

const initGA = (gaID: string) => {
  console.log('[Google-GA4] Initialized!');
  ReactGA.initialize(gaID);
};

const logPageView = () => {
  console.log(`[Google-GA4]: PATH ${window.location.pathname}`);
  ReactGA.set({ page: window.location.pathname });
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};

export default { initGA, logPageView, logEvent };
