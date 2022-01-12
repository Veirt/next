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

    const updateAdHeight = () => setHeight(adRef.current?.offsetHeight !== 0 ? ((adRef.current?.offsetHeight || 0) + 20) : 0);

    useEffect(() => {
        if (!updateTimer.current)
            updateTimer.current = setInterval(updateAdHeight, 500);

        return () => {
            if (updateTimer.current) {
                clearInterval(updateTimer.current);
                updateTimer.current = null;
            }
        }
    }, [ ]);


    return (sessionData && !sessionData.patreon) ? (
        <div className={`${height > 50 ? `content-box w-full flex ${className}` : ''}`} style={{ paddingTop: 0, paddingBottom: 0, height: `${height}px` }}>
            <div className={`w-full flex justify-center items-center`}>
                <div ref={adRef}>
                    {children}
                </div>
            </div>
        </div>
    ) : <></>;
}

export default AdvertisementDisplay;