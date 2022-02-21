import Modal from '../Uncategorized/Modal';

interface IProps {
    toggle: () => void;
    isLoaded?: boolean;
}

const RankedModal = (props: IProps) => {
    const ranks = [
        { name: 'Bronze 1', icon: 'bronze1', sr: '0 - 200', },
        { name: 'Bronze 2', icon: 'bronze2', sr: '200 - 399', },
        { name: 'Bronze 3', icon: 'bronze3', sr: '400 - 599', },
        { name: 'Silver 1', icon: 'silver1', sr: '600 - 799', },
        { name: 'Silver 2', icon: 'silver2', sr: '800 - 999', },
        { name: 'Silver 3', icon: 'silver3', sr: '1000 - 1199', },
        { name: 'Gold 1', icon: 'gold1', sr: '1200 - 1399', },
        { name: 'Gold 2', icon: 'gold2', sr: '1400 - 1599', },
        { name: 'Gold 3', icon: 'gold3', sr: '1600 - 1799', },
        { name: 'Diamond', icon: 'diamond', sr: '1800 - 1999', },
        { name: 'Master', icon: 'master', sr: '2000 - 2199', },
        { name: 'Grandmaster', icon: 'grandmaster', sr: '2200+', },
    ];

    return (
        <Modal isOpened={props.isLoaded} onClose={props.toggle}>
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-6 gap-x-3 gap-y-8">
                {ranks.map((item, index) => (
                    <div key={index}>
                        <div className="block text-center mx-auto">
                            <img src={`/ranks/${item.icon}.svg`} alt={item.name} className="block mx-auto object-contain w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16" />
                            <div className="font-semibold mt-2 text-xs sm:text-sm md:text-base lg:text-lg">{item.name}</div>
                            <div className="text-orange-400 font-semibold text-xs lg:text-sm">{item.sr}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default RankedModal;
