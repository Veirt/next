import {MouseEvent, useCallback, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'next-i18next';
import {faBook, faQuoteRight, faCircleNotch, faBahai, faTrophy} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faList,
    faPlusSquare,
    faRandom,
} from '@fortawesome/free-solid-svg-icons';
import axios, { CancelTokenSource } from 'axios';
import Config from '../../Config';
import LobbiesRow from '../Custom/LobbiesRow';
import {LobbyData, PlayerLevelData} from "../../types.client.mongo";
import {usePlayerContext} from "../../contexts/Player.context";
import useCSRF from "../../hooks/useCSRF";
import useConfig from "../../hooks/useConfig";
import { toast } from 'react-toastify';
import Redirect from '../Uncategorized/Redirect';
import Modal from '../Uncategorized/Modal';

interface TabsInterface {
    name: string;
    description: string;
    enabled: boolean;
    content?: boolean;
    image?: string;
    modes?: {
        name: string;
        description?: string;
        icon: IconDefinition;
        textType?: number;
        color: string;
        badge?: string | number;
        disabled?: {
            level: number;
            isGuest: boolean;
        }
        onClick?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined
    }[];
}

interface IProps {
    mode?: string;
}

const Queue = (props: IProps) => {
    const axiosCancelSource = useRef<CancelTokenSource | null>();

    const { sessionData } = usePlayerContext();
    const { _csrf } = useCSRF();
    const { world } = useConfig();
    const { t } = useTranslation();

    const [ tab, setTab ] = useState(0);
    const [ playerLevel, setPlayerLevel ] = useState<PlayerLevelData | null>(null);
    const [ lobbiesData, setLobbiesData ] = useState<LobbyData[]>([]);
    const [ lobbiesLoaded, setLobbiesLoaded ] = useState(false);
    const [ redirect, setRedirect ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const { mode } = props;

    const getLevel = useCallback(() => {
        if (sessionData) {
            axios.get(`${Config.apiUrl}/player/level`, {withCredentials: true, cancelToken: axiosCancelSource.current?.token})
                .then((response) => {
                    if (!response.data.error) {
                        setPlayerLevel(response.data);
                    } else
                        console.log(response.data.error);
                })
                .catch((e) => console.log(e));
        }
    }, [ sessionData ]);

    const pingCreateMatch = useCallback(async (textType: string) => {
        setLoading(true);

        let text = 0;
        if (textType === 'regular') text = 1;
        if (textType === 'dictionary') text = 2;

        const postData = {
            _csrf,
            worldId: world,
            flagId: 0,
            modeId: 0,
            locale: "en",
            textType: text,
        };

        axios.post(`${Config.apiUrl}/match/search`, postData, { withCredentials: true, cancelToken: axiosCancelSource.current?.token })
            .then((response) => {
                if (!response.data.error)
                    setRedirect(`/game/${textType}`);
                else {
                    setLoading(false);
                    toast.error(response.data.error);
                }
            })
    }, [ _csrf, world ]);

    useEffect(() => {
        if (mode)
            pingCreateMatch(mode).then();
    }, [ mode, pingCreateMatch ]);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();

        getLevel();
        getLobbies();

        return () => axiosCancelSource.current?.cancel();
    }, [ getLevel ]);
    
    const getLobbies = () => {
        axios
            .get(`${Config.apiUrl}/lobby/list`, { cancelToken: axiosCancelSource.current?.token })
            .then(response => {
                if (response.data) {
                    setLobbiesData(response.data);
                    setLobbiesLoaded(true);
                }
            })
            .catch(e => console.log(e));
    }

    const tabs: TabsInterface[] = [
        {
            name: 'page.queue.quickplay.title',
            description: 'page.queue.quickplay.description',
            image: '/assets/play/quickplay.webp',
            enabled: true,
            modes: [
                {
                    name: 'page.queue.random.title',
                    description: 'page.queue.random.description',
                    icon: faRandom,
                    textType: 0,
                    color: 'text-teal-500',
                    onClick: () => pingCreateMatch('random'),
                },
                {
                    name: 'page.queue.quotes.title',
                    description: 'page.queue.quotes.description',
                    icon: faQuoteRight,
                    textType: 1,
                    color: 'text-purple-500',
                    onClick: () => pingCreateMatch('regular'),
                },
                {
                    name: 'page.queue.dictionary.title',
                    description: 'page.queue.dictionary.description',
                    icon: faBook,
                    textType: 2,
                    color: 'text-blue-500',
                    onClick: () => pingCreateMatch('dictionary'),
                },
            ],
        },
        {
            name: 'page.queue.custom.title',
            enabled: true,
            description: 'page.queue.custom.description',
            image: '/assets/play/custom_users.webp',
            modes: [
                {
                    name: 'page.queue.custom.create',
                    icon: faPlusSquare,
                    color: 'text-yellow-500',
                    onClick: () => setRedirect('/custom'),
                },
                {
                    name: 'page.queue.custom.browse',
                    icon: faList,
                    color: 'text-teal-500',
                    badge: lobbiesData?.length || 0,
                    onClick: () => setTab(1),
                },
            ],
        },
        {
            name: 'page.queue.ranked.title',
            description: 'page.queue.ranked.description',
            image: '/ranks/big/gold.webp',
            enabled: true,
            content: true,
            modes: [
                {
                    name: 'page.queue.ranked.join',
                    icon: faBahai,
                    textType: 2,
                    color: 'text-pink-500',
                    onClick: () => false,
                    disabled: {
                        level: 100000000,
                        isGuest: false
                    },
                },
                {
                    name: 'component.navbar.leaders',
                    icon: faTrophy,
                    color: 'text-yellow-400',
                    onClick: () => setRedirect('/leaderboards/ranked/4'),
                },
            ],
        },
    ];

    return (
        <>
            {redirect && redirect !== '' && <Redirect to={redirect} />}
            <div style={{ zIndex: 100 }} className={`${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition ease-in-out duration-200 fixed top-0 right-0 left-0 bottom-0 w-full h-screen bg-black bg-opacity-40`}>
                <div className={"flex h-screen"}>
                    <div className={"m-auto w-80 flex p-4 rounded-2xl shadow-lg bg-gray-750 border border-gray-800"}>
                        <div className={"w-12"}>
                            <FontAwesomeIcon icon={faCircleNotch} className={"text-blue-400 text-center"} size={"2x"} spin />
                        </div>
                        <div className={"w-auto my-auto"}>
                            <div className={"text-xl uppercase font-semibold text-white"}>
                                Finding Match
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpened={(lobbiesLoaded && tab === 1)} onClose={() => setTab(0)}>
                <div className="h3">{t('page.queue.custom.public')}</div>
                <div className="h-full overflow-y-auto">
                    {lobbiesData.length !== 0
                        ? lobbiesData.map(row => <LobbiesRow key={row.invite} {...row} />)
                        : <div className="py-32 w-full bg-black-light text-sm uppercase text-white font-semibold text-center">{t('page.queue.custom.none')}</div>
                    }
                </div>
            </Modal>

            <audio id="MatchFound" src="/audio/MatchFound.wav" crossOrigin="anonymous" preload="auto" />

            <div className={"grid grid-cols-1 lg:grid-cols-3 3xl:grid-cols-3 gap-8 lg:gap-4 mb-4 content-box"} style={{ paddingLeft: 0, paddingRight: 0 }}>
                {tabs.map((tab, index) => (
                    <div key={index} className={`relative col-span-full lg:col-span-1 3xl:col-span-1 px-8`}>
                        {/* Custom Border */}
                        {index !== 0 && <div className="h-full border-r-4 border-gray-800 absolute -left-2.5 z-20" />}
                        {/* Flex / Icon */}
                        <div className="relative">
                            <div className="absolute top-0 -right-8 z-0">
                                <img className={"h-64 -mt-16 object-cover object-center transform opacity-50"} src={tab.image || ''} alt={"Panel"} />
                            </div>
                            <div className="h1 text-white relative z-10">{t(tab?.name)}</div>
                            <p className="pt-1 pb-6 block relative z-10 text-gray-300 truncate">
                                {t(tab?.description)}
                            </p>
                            {/* Buttons */}
                            <div className="flex flex-wrap space-x-1 relative z-10">
                                {tab?.modes?.map((item) => (
                                    <button key={item.name} onClick={item.onClick} className={`py-1.5 px-3 bg-gray-825 bg-opacity-90 hover:bg-opacity-70 rounded-lg transition ease-in-out duration-200 ${(item.disabled && sessionData && ((playerLevel !== null && playerLevel?.Index) < item.disabled.level || sessionData.authName === 'Guest')) ? 'pointer-events-none opacity-80' : ''}`}>
                                        <div className={"flex justify-center text-white text-xs lg:text-sm uppercase font-bold tracking-tight"}>
                                            <div className={"w-5 lg:mt-px text-center sm:text-left lg:text-center 4xl:text-left"}>
                                                <FontAwesomeIcon icon={item.icon} className={`${(item.disabled && sessionData && ((playerLevel !== null && playerLevel?.Index) < item.disabled.level || sessionData.authName === 'Guest')) ? 'text-gray-600' : item.color}`} />
                                            </div>
                                            <div className={"hidden sm:block lg:hidden 4xl:block w-auto"}>
                                                {t(item.name)}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Queue;
