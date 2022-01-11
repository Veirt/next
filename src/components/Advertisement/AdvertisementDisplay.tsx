import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { usePlayerContext } from "../../contexts/Player.context";

interface IProps {
    className?: string;
    type: string;
    children: ReactNode;
}

const AdvertisementDisplay = (props: IProps) => {

    const { className, children } = props;
    const adRef = useRef<HTMLDivElement | null>(null);

    const [ height, setHeight ] = useState<number>(0);

    const { sessionData } = usePlayerContext();

    useLayoutEffect(() => {
        console.log('Ad Ref Change');
        if (adRef.current) 
            setHeight(adRef.current.offsetHeight + 20);
    });

    /*
    let useHeight = 'h-64';
    if (type === 'square') 
        useHeight = 'h-72';
    else if (type === 'sidebar')
        useHeight = 'h-212';
    else if (type === 'leaderboard')
        useHeight = 'h-48';
    else if (type === 'leaderboard-small')
        useHeight = 'h-32';
    */

    return (sessionData && !sessionData.patreon) ? (
        <div className={`content-box w-full flex ${className}`} style={{ paddingTop: 0, paddingBottom: 0, height: `${height + 20}px` }}>
            <div className={`w-full flex justify-center items-center`}>
                <div ref={adRef}>
                    {children}
                </div>
            </div>
        </div>
    ) : <></>;
}

export default AdvertisementDisplay;