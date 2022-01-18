import {ReactElement, ReactNode, useEffect, useRef, useState} from 'react';
import LoadingScreen from "./Uncategorized/LoadingScreen";

interface LoadContentProps {
    isLoaded: boolean;
    isPartial?: boolean;
    children: ReactElement | ReactNode | HTMLElement;
    disableTransform?: boolean;
}

const LoadContent = (props: LoadContentProps) => {

    const { isLoaded } = props;

    const clearInterval = useRef<NodeJS.Timeout | null>(null);
    const [ mountTranslate, setMountTranslate ] = useState<boolean>(true);

    useEffect(() => {
        if (!clearInterval.current) 
            clearInterval.current = setTimeout(() => setMountTranslate(false), 300);

        return () => {
            if (clearInterval.current) {
                clearTimeout(clearInterval.current);
                clearInterval.current = null;
            }
        }
    }, [ isLoaded ]);

    return (
        <>
            <div className={`${props.isLoaded ? `${!props.disableTransform && `${mountTranslate ? 'translate-y-0' : ''}`} opacity-100` : `${!props.disableTransform && 'translate-y-1'} opacity-0`} transition ease-in-out duration-200`}>
                {props.isLoaded ? props.children : ''}
            </div>
            {(!props.disableTransform && !props.isLoaded) ? <LoadingScreen isPartial={props.isPartial} /> : ''}
        </>
    )
}

export default LoadContent;