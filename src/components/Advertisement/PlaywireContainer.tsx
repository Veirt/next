// @ts-nocheck
import { useEffect } from 'react';
import { usePlayerContext } from '../../contexts/Player.context';

interface IProps {
    enableBottomRail?: boolean;
    enableTrendiVideo?: boolean;
}

function Playwire(props: IProps) {
    const { sessionData } = usePlayerContext();

    // These are Hard coded units, but could be passed as props to only initiate units that existing within the page.
    const pwUnits = [
        { selectorId: 'desktop-top-leaderboard', type: 'leaderboard_atf' },
        { selectorId: 'desktop-bottom-leaderboard', type: 'leaderboard_btf' },
        // { selectorId: 'mobile-leaderboard', type: '320x50' },
        { selectorId: 'responsive-top-square', type: 'med_rect_atf' },
        { selectorId: 'responsive-bottom-square', type: 'med_rect_btf' },
        //{ selectorId: 'responsive-top-skyscraper', type: 'sky_atf' },
        //{ selectorId: 'responsive-bottom-skyscraper', type: 'sky_btf' },
        { type: 'desktop_in_article' },
        { type: 'mobile_in_article' },
    ];

    if (props.enableBottomRail) 
        pwUnits.push({ type: 'bottom_rail' });

    if (props.enableTrendiVideo)
        pwUnits.push({ type: 'trendi_video' });

    // Debounce Method
    const debounce = (callback, wait) => {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                // eslint-disable-next-line
                callback.apply(null, args);
            }, wait);
        };
    };

    // Skyscraper Ads using Debounce
    const handleAdResizeAndLoad = debounce(() => {
        console.log('[Playwire] Debounce called');
        // Replace the Units or array of units that you wish to destroy on resize.
        const pwSkyId = ['pw-160x600_atf', 'pw-160x600_btf'];

        // Replace array with destroyed units you wish to re add to the site.
        const pwSkyArray = [
            { selectorId: 'responsive-top-skyscraper', type: 'sky_atf' },
            { selectorId: 'responsive-bottom-skyscraper', type: 'sky_btf' },
        ];

        // Replace with the AdUnit you wish to check for.
        const leaderboardAtf = document.querySelector('#pw-160x600_atf');
        const leaderboardBtf = document.querySelector('#pw-160x600_btf');

        // When window width hides the ad, destroy the Units on the Array.
        // Change innerWidth to your relevant size.
        if (window.innerWidth < 1920) {
            ramp.destroyUnits(pwSkyId).catch((e) => {
                console.log('displayUnits error: ', e);
            });
            // When window width is big enough to show the unit and the ads chosen are not present in the page, add and display the units.
        } else if (window.innerWidth >= 1920 && !leaderboardAtf && !leaderboardBtf) {
            ramp.addUnits(pwSkyArray)
                .then(() => {
                    ramp.displayUnits();
                })
                .catch((e) => {
                    ramp.displayUnits();
                    console.log('displayUnits error: ', e);
                });
        }
    }, 500);

    // Use effect to only fire this function on component first load.
    useEffect(() => {
        console.log('[Playwire] Component Created!');
        const init = () => {
            if (typeof window !== 'undefined')
                console.log('[Playwire] Initialized');
            else 
                console.log('[Playwire] Unable to initialize');

            // Will check if the ramp queue array already exists, if it does not it will create it.
            if (!window.ramp) window.ramp = {  que: window?.ramp?.que || [] }
            window.ramp.que = window.ramp.que || [];

            // We will push our promise chain into the react queue array and invoke it below.
            window.ramp.que.push(() => {
                console.log(window.ramp.que);
                window.ramp.destroyUnits('all').then(() => {
                    console.log('[Playwire] destroy Unit Gets Executed');
                    // @ts-ignore
                    window.ramp
                        .addUnits(pwUnits)
                        .then(() => {
                            // @ts-ignore
                            window.ramp.displayUnits();
                            console.log('[Playwire] RAMP API Done');
                        })
                        .catch((e) => {
                            // @ts-ignore
                            window.ramp.displayUnits();
                            window.console.log('[Playwire] displayUnits error: ', e);
                        });
                    handleAdResizeAndLoad();
                });
                 
                window.addEventListener('resize', handleAdResizeAndLoad);
                window.onload = handleAdResizeAndLoad;
            });
        };

        if (sessionData && !sessionData.patreon && !sessionData.staff) init();

        return () => {
            window.removeEventListener('resize', handleAdResizeAndLoad);
        }
        // eslint-disable-next-line
    }, [ ]);

    return <></>;
}

export default Playwire;
