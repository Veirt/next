import { ReactNode, useEffect, useRef, useState } from "react";
import { usePlayerContext } from "../../contexts/Player.context";

interface IProps {
    className?: string;
    type: string;
    children: ReactNode;
}

const AdvertisementDisplay = (props: IProps) => {

    const { className, children } = props;
    const adRef = useRef<HTMLDivElement | null>(null);
    const updateTimer = useRef<NodeJS.Timer | null>(null);

    const [ height, setHeight ] = useState<number>(0);
    const { sessionData } = usePlayerContext();


    const updateAdHeight = () => {
        console.log('Ad Height Updated');
        if (height <= 20) 
            setHeight((adRef.current?.offsetHeight || 0) + 20);
        else {
            if (updateTimer.current) {
                clearInterval(updateTimer.current);
                updateTimer.current = null; 
            }
        }
    };

    useEffect(() => {
        updateTimer.current = setInterval(updateAdHeight, 250);

        return () => {
            if (updateTimer.current) {
                clearInterval(updateTimer.current);
                updateTimer.current = null;
            }
        }
    }, []);


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