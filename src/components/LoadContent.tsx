import {ReactElement, ReactNode} from 'react';
import LoadingScreen from "./Uncategorized/LoadingScreen";

interface LoadContentProps {
    isLoaded: boolean;
    isPartial?: boolean;
    children: ReactElement | ReactNode | HTMLElement;
    disableTransform?: boolean;
}

const LoadContent = (props: LoadContentProps) => {
    return (
        <>
            <div className={`${props.isLoaded ? `${!props.disableTransform && 'translate-y-0'} opacity-100` : `${!props.disableTransform && 'translate-y-1'} opacity-0`} transition ease-in-out duration-200`}>
                {props.isLoaded ? props.children : ''}
            </div>
            {(!props.disableTransform && !props.isLoaded) ? <LoadingScreen isPartial={props.isPartial} /> : ''}
        </>
    )
}

export default LoadContent;