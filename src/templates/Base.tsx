
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import PlaywireContainer from '../components/Advertisement/PlaywireContainer';
import SidebarSquare from '../components/Advertisement/SidebarSquare';
import LoadContent from '../components/LoadContent';
import Redirect from '../components/Uncategorized/Redirect';
import useConfig from '../hooks/useConfig';
import useGoogleAnalytics from '../hooks/useGoogleAnalytics';
import Levelbar from '../layout/Levelbar';

type IMainProps = {
    meta: ReactNode;
    children: ReactNode;
    ads?: {
      enableBottomRail?: boolean;
      enableTrendiVideo?: boolean;
    }
    isLoaded?: boolean;
    noAnimate?: boolean;
    noNav?: boolean;
};

const Base = (props: IMainProps) => {
    useGoogleAnalytics();

    const timer = useRef<NodeJS.Timeout | null>(null);
    const [ redirect, setRedirect ] = useState<string>('');
    const [ loaded, setLoaded ] = useState<boolean>(props.noAnimate === true);
    const { shortcutHome, shortcutExit, shortcutPlayRandom, shortcutPlayQuotes, shortcutPlayDictionary } = useConfig();

    const onTimerCalled = () => setLoaded(true);

    const redirectTo = (uri: string, isRefresh?: boolean, isBack?: boolean) => {
        console.log('shortcut called', uri);
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
            {props.meta}
            {!props.noNav ? <Levelbar /> : ''}
            <main>
                <LoadContent isLoaded={loaded}>
                    <PlaywireContainer {...props.ads} />
                    <>{props.children}</>

                    <div className="hidden 3xl:block absolute top-20 left-0">
                        <SidebarSquare key={"left"} />
                    </div>
                    <div className="hidden 3xl:block absolute top-20 right-0">
                        <SidebarSquare key={"right"} />
                    </div>
                </LoadContent>
            </main>
        </>
    ) : <></>;
};

export default Base;
