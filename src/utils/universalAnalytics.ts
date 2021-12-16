import ReactGA from 'react-ga'

const initGA = (gaID: string) => {
  console.log('[Google-UA] Initialized!')
  ReactGA.initialize(gaID)
}

const logPageView = () => {
  console.log(`[Google-UA] PATH: ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action })
  }
}

const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}

export default { initGA, logPageView, logEvent, logException };