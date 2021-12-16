import { useRouter } from 'next/router';
import { useEffect } from 'react';
import universalAnalytics from '../utils/universalAnalytics';
import googleAnalytics from '../utils/googleAnalytics';

const useGoogleAnalytics = () => {
    const router = useRouter();

    const logPageView = () => {
        universalAnalytics.logPageView();
        googleAnalytics.logPageView();
    }

    useEffect(() => {
        console.log('Google Analytics Initialized!');
        googleAnalytics.initGA('G-C9XCQ04FCC');
        universalAnalytics.initGA('UA-169806672-1');
        // `routeChangeComplete` won't run for the first page load unless the query string is
        // hydrated later on, so here we log a page view if this is the first render and
        // there's no query string
        if (!router.asPath.includes('?')) 
          logPageView();
          
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        // Listen for page changes after a navigation or when the query changes
        router.events.on('routeChangeComplete', logPageView);
        return () => {
          router.events.off('routeChangeComplete', logPageView)
        }
    }, [router.events])

    return <></>;
}

export default useGoogleAnalytics;