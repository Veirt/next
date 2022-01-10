import { ReactNode } from "react";
import { usePlayerContext } from "../../contexts/Player.context";

interface IProps {
    className?: string;
    type: string;
    children: ReactNode;
}

const AdvertisementDisplay = (props: IProps) => {

    const { className, type, children } = props;

    const { sessionData } = usePlayerContext();

    let useHeight = 'h-64';
    if (type === 'square') 
        useHeight = 'h-72';
    else if (type === 'sidebar')
        useHeight = 'h-212';
    else if (type === 'leaderboard')
        useHeight = 'h-48';
    else if (type === 'leaderboard-small')
        useHeight = 'h-32';

    return (sessionData && !sessionData.patreon) ? (
        <div className={`content-box w-full flex ${useHeight} ${className}`} style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className={`w-full flex justify-center items-center`}>
                <div>
                    {children}
                </div>
            </div>
        </div>
    ) : <></>;
}

export default AdvertisementDisplay;