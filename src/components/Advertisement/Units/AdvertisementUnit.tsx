interface IProps {
    type: string;
}

const AdvertisementUnit = (props: IProps) => {
    /*
    { selectorId: 'desktop-top-leaderboard', type: 'leaderboard_atf' },
        { selectorId: 'desktop-bottom-leaderboard', type: 'leaderboard_btf' },
        { selectorId: 'mobile-leaderboard', type: '320x50' },
        { selectorId: 'responsive-top-square', type: 'med_rect_atf' },
        { selectorId: 'responsive-bottom-square', type: 'med_rect_btf' },
        { selectorId: 'responsive-top-skyscraper', type: 'sky_atf' },
        { selectorId: 'responsive-bottom-skyscraper', type: 'sky_btf' },
    */

    const { type } = props;

    let useName = 'responsive-top-square';
    if (type === 'leaderboard-top')
        useName = 'desktop-top-leaderboard';
    else if (type === 'leaderboard-bottom')
        useName = 'desktop-bottom-leaderboard';
    else if (type === 'mobile-leaderboard')
        useName = 'mobile-leaderboard';
    else if (type === 'responsive-square-one')
        useName = 'responsive-top-square';
    else if (type === 'responsive-square-two')
        useName = 'responsive-bottom-square';
    else if (type === 'responsive-skyscraper-one')
        useName = 'responsive-top-skyscraper';
    else if (type === 'responsive-skyscraper-two')
        useName = 'responsive-bottom-skyscraper';

    return <div id={useName} className="pwUnit" />;
}

export default AdvertisementUnit;