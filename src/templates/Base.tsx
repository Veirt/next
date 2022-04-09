
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import ReactTooltip from 'react-tooltip';
import AdvertisementSticky from '../components/Advertisement/AdvertisementSticky';
import PlaywireContainer from '../components/Advertisement/PlaywireContainer';
import LoadContent from '../components/LoadContent';
import Matchmaking from '../components/Uncategorized/Matchmaking';
import Redirect from '../components/Uncategorized/Redirect';
import { usePlayerContext } from '../contexts/Player.context';
import useConfig from '../hooks/useConfig';
import useGoogleAnalytics from '../hooks/useGoogleAnalytics';
import Levelbar from '../layout/Levelbar';

type IMainProps = {
    meta: ReactNode;
    children: ReactNode;
    ads?: {
      enableBottomRail?: boolean;
      enableTrendiVideo?: boolean;
      disableStickyVertical?: boolean;
    }
    isLoaded?: boolean;
    noAnimate?: boolean;
    noNav?: boolean;
    contentTopBorder?: boolean;
};

const Base = (props: IMainProps) => {
    useGoogleAnalytics();

    const timer = useRef<NodeJS.Timeout | null>(null);
    const [ redirect, setRedirect ] = useState<string>('');
    const [ loaded, setLoaded ] = useState<boolean>(props.noAnimate === true);
    const { sessionData } = usePlayerContext();
    const { shortcutHome, shortcutExit, shortcutPlayRandom, shortcutPlayQuotes, shortcutPlayDictionary } = useConfig();

    const onTimerCalled = () => setLoaded(true);

    const redirectTo = (uri: string, isRefresh?: boolean, isBack?: boolean) => {
        if (isRefresh) return window.location.reload();
        if (isBack) return window.history.back();
        if (!isRefresh && !isBack) {
          setRedirect(uri);
          setTimeout(() => {
            setRedirect('');
          }, 1);
        }
    };

    const keyMap = {
        REDIRECT_PLAY: shortcutExit.toLowerCase(),
        REDIRECT_HOME: shortcutHome.toLowerCase(),
        REDIRECT_PLAY_RANDOM: shortcutPlayRandom.toLowerCase(),
        REDIRECT_PLAY_QUOTES: shortcutPlayQuotes.toLowerCase(),
        REDIRECT_PLAY_DICTIONARY: shortcutPlayDictionary.toLowerCase(),
    };

    const handlers = {
        REDIRECT_PLAY: () => redirectTo('/', false, false),
        REDIRECT_HOME: () => redirectTo('/', false, false),
        REDIRECT_PLAY_RANDOM: () => redirectTo('/play/random', false, false),
        REDIRECT_PLAY_QUOTES: () => redirectTo('/play/regular', false, false),
        REDIRECT_PLAY_DICTIONARY: () => redirectTo('/play/dictionary', false, false),
    };


    useEffect(() => {
        if (!props.noAnimate && (typeof props.isLoaded === 'undefined' || (typeof props.isLoaded !== 'undefined' && props.isLoaded)))
            timer.current = setTimeout(onTimerCalled, 1);
        else 
            console.log('Failed to queue animation');
        return () => {
            if (timer.current) clearTimeout(timer.current);
        }
    }, [ props.isLoaded, props.noAnimate ]);

    if (redirect)
        return <Redirect to={redirect} />;
        
    return props ? (
        <>
            <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
            <ReactTooltip /> 
            {props.meta}
            {!props.noNav ? <Levelbar /> : ''}
            {props.contentTopBorder && (
                <div className="container">
                    <div className="border-t border-gray-800" />
                </div>
            )}
            <main>
                <div className="bgOverlay" />
                {(!props.ads?.disableStickyVertical) && (
                    <>
                        <AdvertisementSticky position="left" />
                        <AdvertisementSticky position="right" />
                    </>
                )}
                {sessionData !== null && <Matchmaking />}
                <LoadContent isLoaded={loaded}>
                    {sessionData !== null && <PlaywireContainer {...props.ads} />}
                    <>{props.children}</>
                </LoadContent>
            </main>
        </>
    ) : <></>;
};

export default Base;
