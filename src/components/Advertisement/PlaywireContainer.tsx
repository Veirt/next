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
        { selectorId: 'mobile-leaderboard', type: '320x50' },
        { selectorId: 'responsive-top-square', type: 'med_rect_atf' },
        { selectorId: 'responsive-bottom-square', type: 'med_rect_btf' },
        { selectorId: 'responsive-top-skyscraper', type: 'sky_atf' },
        { selectorId: 'responsive-bottom-skyscraper', type: 'sky_btf' },
        { type: 'desktop_in_article' },
        { type: 'mobile_in_article' },
    ];

    if (props.enableBottomRail) 
        pwUnits.push({ type: 'bottom_rail' });

    if (props.enableTrendiVideo)
        pwUnits.push({ type: 'trendi_video' });

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
                });
            });
        };

        if ((!sessionData || (sessionData && !sessionData.patreon && !sessionData.staff))) init();
        // eslint-disable-next-line
    }, [ ]);

    return <></>;
}

export default Playwire;
