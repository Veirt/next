import React, { ReactNode, useEffect, useRef, useState } from 'react';
import PlaywireContainer from '../components/Advertisement/PlaywireContainer';
import LoadContent from '../components/LoadContent';
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

    const [ loaded, setLoaded ] = useState<boolean>(props.noAnimate === true);

    const onTimerCalled = () => {
        setLoaded(true);  
    }

    useEffect(() => {
        if (!props.noAnimate && (typeof props.isLoaded === 'undefined' || (typeof props.isLoaded !== 'undefined' && props.isLoaded)))
            timer.current = setTimeout(onTimerCalled, 1);
        else 
            console.log('Failed to queue animation');
        return () => {
            if (timer.current) clearTimeout(timer.current);
        }
    }, [ props.isLoaded, props.noAnimate ]);

    return props ? (
        <>
            {props.meta}
            {!props.noNav ? <Levelbar /> : ''}
            <main>
                <LoadContent isLoaded={loaded}>
                    <PlaywireContainer {...props.ads} />
                    <>{props.children}</>
                </LoadContent>
            </main>
        </>
    ) : <></>;
};

export default Base;
