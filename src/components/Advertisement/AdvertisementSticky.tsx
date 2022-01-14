import { ReactNode } from "react";

interface IProps {
    position?: 'left' | 'right';
    className?: string;
    children: ReactNode;
}

const AdvertisementSticky = (props: IProps) => {
    const { position, className } = props;

    let useCSS = className || '';
    if (position === 'left')
        useCSS = 'left-0';
    else if (position === 'right')
        useCSS = 'right-0';

    return (
        <div className={`top-16 ${useCSS}`}>

        </div>
    )
};

export default AdvertisementSticky;