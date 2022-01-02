import { useTranslation, Trans } from 'next-i18next';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleRight} from "@fortawesome/free-solid-svg-icons";
import Modal from '../Uncategorized/Modal';

interface IProps {
    toggle: () => void;
    isLoaded?: boolean;
}

const RankedModal = (props: IProps) => {
    const { t } = useTranslation();
    
    const ranks = [
        {
            name: 'Bronze',
            sr: '1 - 850',
        },
        {
            name: 'Silver',
            sr: '850 - 1299',
        },
        {
            name: 'Gold',
            sr: '1300 - 1749',
        },
        {
            name: 'Diamond',
            sr: '1750 - 2199',
        },
        {
            name: 'Master',
            sr: '2200 - 2399',
        },
        {
            name: 'Grandmaster',
            sr: '2400 +',
        },
    ];

    return (
        <Modal isOpened={props.isLoaded} onClose={props.toggle}>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-2/3 p-6">
                    <div>
                        <div className="text-white text-lg uppercase font-bold tracking-wider border-b border-gray-700 pb-2 mb-2">{t('page.queue.howToPlayGuide.1_title')}</div>
                        <div className="text-gray-300 text-sm tracking-wider">
                            <Trans i18nKey="page.queue.howToPlayGuide.1_description">
                                In order to play Ranked Matchmaking you must be at least <span className="font-semibold">Level 10</span>. You will be placed through a calculation stage where you will not see your rank until you have finished <span className="font-semibold">5 matches</span>. This will ensure the accuracy of your skill level when you get matched against other players.
                            </Trans>
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="text-white text-lg uppercase font-bold tracking-wider border-b border-gray-700 pb-2 mb-2">What is Ranked?</div>
                        <div className="text-gray-300 text-sm tracking-wider">
                            {t('page.queue.howToPlayGuide.2_description')}
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="text-white text-lg uppercase font-bold tracking-wider border-b border-gray-700 pb-2 mb-2">How is SR determined?</div>
                        <div className="text-gray-300 text-sm tracking-wider">
                            {t('page.queue.howToPlayGuide.3_description')}
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="text-white text-lg uppercase font-bold tracking-wider border-b border-gray-700 pb-2 mb-2">Can we quit mid-game?</div>
                        <div className="text-gray-300 text-sm tracking-wider">
                            <Trans i18nKey="page.queue.howToPlayGuide.4_description">Due to the competitive nature it is extremely discouraged to quit a game. If you quit before you finish playing your ranked game then <span className="text-red-400">20 points</span> will be deducted from your skill rating. Additionally if your opponent finishes the game you will suffer the loss as if you had completed the match.</Trans>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button onClick={props.toggle} className="text-base tracking-wider font-semibold uppercase text-orange-400">
                            {t('button.letsgo')} <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </button>
                    </div>
                </div>
                <div className="w-full lg:w-1/3 bg-gray-825 p-6 rounded-2xl">
                    {ranks.map(item => (
                        <div key={item.name} className="flex text-white py-3">
                            <div className="w-10 my-auto">
                                <img src={`/ranks/${item.name.toLowerCase()}.png`} className="w-full h-auto" alt="skillrank" />
                            </div>
                            <div className="pl-2 w-full">
                                <div className="text-xl font-semibold uppercase tracking-wider">{item.name}</div>
                                <div className="mt-1 text-orange-400 font-semibold tracking-wider">{item.sr}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default RankedModal;
