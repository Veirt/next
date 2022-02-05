import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import '../scss/tainwind.scss';

import CookieConsent from 'react-cookie-consent';
import { ToastContainer } from 'react-toastify';
import { PlayerProvider } from '../contexts/Player.context';

import reportWebVitals from '../reportWebVitals';
import React from 'react';
import NextNProgress from 'nextjs-progressbar';
import { GlobalProvider } from '../contexts/Global.context';

const MyApp = ({ Component, pageProps }: AppProps) => (
    // -mt-2 pl-12 translate-y-64 bg-red-400 bg-yellow-400 font-sans font-mono bg-red-600 bg-blue-600 bg-opacity-20 bg-opacity-10 border-red-400 border-blue-400 bg-gray-800 bg-opacity-20 border-orange-400
    // eslint-disable-next-line react/jsx-props-no-spreading
    <>
      <ToastContainer />
      <GlobalProvider>
        <PlayerProvider>
          <NextNProgress
            color="#FB923C"
            startPosition={0.3}
            stopDelayMs={400}
            height={2}
            showOnShallow={true}
          />
            <Component {...pageProps} />
            <CookieConsent
                style={{ background: '#000' }}
                contentStyle={{ margin: '7px' }}
                buttonStyle={{
                    background: '#FB923C',
                    color: '#000',
                    fontSize: '14px',
                    margin: '7px',
                }}
            >
                This website uses cookies to enhance the user experience.
            </CookieConsent>
        </PlayerProvider>
      </GlobalProvider>
    </>
);

if (typeof document !== 'undefined')
   reportWebVitals(console.log);

export default appWithTranslation(MyApp);
