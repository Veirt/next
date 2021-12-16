import {MouseEvent, useCallback, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'next-i18next';
import {faBook, faQuoteRight, faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faAngleDoubleLeft, faClock,
    faList, faLock,
    faPlusSquare,
    faQuestionCircle,
    faRandom,
    faBahai, 
    faTrophy, 
    faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import axios, { CancelTokenSource } from 'axios';
import Config from '../../Config';
import LobbiesRow from '../Custom/LobbiesRow';
import Socket from '../../utils/socket/Socket';
import RankedModal from "./RankedModal";
import QueueToast from "./QueueToast";
import {LobbyData, PlayerCompetitiveData, PlayerLevelData, TournamentData} from "../../types.client.mongo";
import {usePlayerContext} from "../../contexts/Player.context";
import useCSRF from "../../hooks/useCSRF";
import useConfig from "../../hooks/useConfig";
import usePlayerToken from "../../hooks/usePlayerToken";
import { toast } from 'react-toastify';
import moment from "moment";
import Link from '../Uncategorized/Link';
import Redirect from '../Uncategorized/Redirect';

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
        disabled?: {
            level: number;
            isGuest: boolean;
        }
        onClick?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined
    }[];
}

interface IProps {
    mode?: string;
    tournamentData?: TournamentData[];
}

const Queue = (props: IProps) => {
    const axiosCancelSource = useRef<CancelTokenSource | null>();

    const { sessionData } = usePlayerContext();
    const { playerToken } = usePlayerToken();
    const { _csrf } = useCSRF();
    const { world } = useConfig();
    const { t } = useTranslation();

    const [ socket, setSocket ] = useState<Socket | null>(null);
    const [ tab, setTab ] = useState(0);
    const [ showRankedHelp, setShowRankedHelp ] = useState(false);
    const [ playerRank, setPlayerRank ] = useState<PlayerCompetitiveData | null>(null);
    const [ playerLevel, setPlayerLevel ] = useState<PlayerLevelData | null>(null);
    const [ lobbiesData, setLobbiesData ] = useState<LobbyData[]>([]);
    const [ lobbiesLoaded, setLobbiesLoaded ] = useState(false);
    const [ queueJoined, setQueueJoined ] = useState(false);
    const [ queueFound, setQueueFound ] = useState(false);
    const [ queueTimer, setQueueTimer ] = useState(0);
    const [ redirect, setRedirect ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const { tournamentData, mode } = props;

    const getRanked = useCallback(() => {
        if (sessionData) {
            axios.get(`${Config.apiUrl}/player/ranked`, {withCredentials: true, cancelToken: axiosCancelSource.current?.token})
                .then((response) => {
                    if (!response.data.error) {
                        setPlayerRank(response.data.Rank);
                    } else
                        toast.error(response.data.error);
                })
                .catch(e => console.log(e));
        }
    }, [ sessionData ]);

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
        getRanked();
        getLobbies();

        return () => axiosCancelSource.current?.cancel();
    }, [ getLevel, getRanked ]);

    useEffect(() => {
        let redirectInterval: NodeJS.Timeout | null = null;

        if (queueFound) {
            redirectInterval = setTimeout(() => {
                setRedirect('/game');
            }, 5000);
        }
        return () => {
            if (redirectInterval)
                clearInterval(redirectInterval);
        }
    }, [ redirect, queueFound ]);

    useEffect(() => {
        let intervalQueue: NodeJS.Timer | null = null;
        if (!mode) {

            socket?.onError(() => {
                setQueueJoined(false)
                setQueueTimer(0);
                if (intervalQueue)
                    clearInterval(intervalQueue);
            });

            socket?.onDisconnect(() => {
                setQueueJoined(false)
                setQueueTimer(0);
                if (intervalQueue)
                    clearInterval(intervalQueue);
            });
            socket?.onConnect(() => {
                socket?.emit('joinQueue', { playerToken });

                socket?.on('isBanned', (data: { message: string }) => toast.error(data.message));

                socket?.on('startQueue', () => {
                    setQueueJoined(true);
                    if (!intervalQueue)
                        intervalQueue = setInterval(() => setQueueTimer(q => (q + 1)), 1000);
                });

                socket?.on('foundQueue', (data: { playersFound: string[] }) => {
                    const array = data.playersFound;
                    if (sessionData) {
                        if (array.includes(sessionData.playerId)) {
                            playSound();
                            setQueueFound(array.includes(sessionData.playerId));
                            document.title = 'Match Found!';
                        }
                    }
                });
            });
        }

        return () => {
            socket?.disconnect();
            setQueueTimer(0);
            setQueueJoined(false);

            if (intervalQueue)
                clearInterval(intervalQueue);
        }
    }, [ mode, socket, sessionData, playerToken ]);

    const joinQueue = () => {
        if (window) {
            setSocket(new Socket(`${Config.gameServer.URL}${Config.gameServer.Port !== null ? `:${Config.gameServer.Port}` : ''}/queue`, {
                transports: ['websocket', 'polling'],
            }));
        }
        //toast.Error("Matchmaking is temporarily unavailable, please try again later.");
    }

    const playSound = () => (document.getElementById('MatchFound') as HTMLAudioElement).play();

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
            name: 'page.queue.ranked.title',
            description: 'page.queue.ranked.description',
            enabled: true,
            content: true,
            modes: [
                {
                    name: 'page.queue.ranked.join',
                    icon: faBahai,
                    textType: 2,
                    color: 'text-pink-500',
                    onClick: () => joinQueue(),
                    disabled: {
                        level: 10,
                        isGuest: false
                    }
                },
                {
                    name: 'page.queue.ranked.how',
                    icon: faQuestionCircle,
                    textType: 2,
                    color: 'text-red-500',
                    onClick: () => setShowRankedHelp(true),
                },

                {
                    name: 'component.navbar.leaders',
                    icon: faTrophy,
                    color: 'text-yellow-400',
                    onClick: () => setRedirect('/leaderboards/ranked/3'),
                },
            ],
        },
        {
            name: 'component.navbar.tournaments',
            enabled: true,
            description: '',
            image: '/assets/play/competitions.webp',
            modes: [],
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
                    onClick: () => setTab(1),
                },
            ],
        },
    ];

    return (
        <>
            {redirect && redirect !== '' && <Redirect to={redirect} />}
            {queueJoined && <QueueToast onClick={() => setSocket(null)} timer={queueTimer} found={queueFound} />}
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
            <audio id="MatchFound" src="/audio/MatchFound.wav" crossOrigin="anonymous" preload="auto" />
            <div className={"grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-4 gap-8 lg:gap-4 2xl:gap-8 mb-8"}>
                {tabs.map((tab, index) => (
                    <div key={index} className={"h-full"}>
                        <div className={"bg-gray-750 text-2xl uppercase font-bold py-2.5 mb-4 rounded-xl text-center text-white"}>
                            {t(tab?.name)}
                        </div>

                        <div className={"rounded-lg bg-gradient-to-b from-gray-750 to-gray-775 border-b-4 border-gray-800 px-6 pb-6 pt-2 shadow-lg relative z-10"}>
                            <div className={"grid grid-cols-1 sm:grid-cols-3 3xl:grid-cols-1"}>
                                <div className={"relative col-span-full sm:col-span-1 3xl:col-span-full"}>
                                    {(playerRank !== null && playerLevel !== null && tab.name === 'page.queue.ranked.title' && sessionData?.authName !== 'Guest' && playerLevel.Index >= 10) && (
                                        <div className={`z-20 absolute ${playerRank.Games < 10 ? 'w-52' : 'w-32'} top-3 left-0 right-0 mx-auto bg-black bg-opacity-60 text-white font-semibold rounded-xl px-2 text-center py-1 text-sm`}>
                                            {playerRank.Games < 10
                                                ? <div><span className={"text-orange-400"}>{10 - playerRank.Games}</span> Games Remaining</div>
                                                : <div className={"text-3xl font-bold"}>{playerRank.SR}<span className={"text-gray-400 text-sm lg:text-lg"}>SR</span></div>
                                            }
                                        </div>
                                    )}
                                    {(tab.name === 'page.queue.ranked.title')
                                        ? <img className={"block mx-auto w-auto h-40 3xl:h-72 object-fit transform scale-110"} alt="Rank" src={`/ranks/big/${((playerLevel !== null && playerLevel.Index < 10) || (playerRank && playerRank.Games < 10) || !playerRank || !playerLevel) ? 'unranked' : playerRank?.Rank.toLowerCase() }.webp`} />
                                        : <img className={"block mx-auto w-auto h-40 3xl:h-72 object-fit transform scale-110"} src={tab.image || ''} alt={"Panel"} />
                                    }
                                </div>

                                <div className={"col-span-full sm:col-span-2 3xl:col-span-full"}>
                                    <div className={`grid grid-cols-1 gap-3 mt-2`}>
                                        {tab?.modes?.map((item) => (
                                            <div key={item.name} className={"px-0 lg:px-6 4xl:px-10"}>
                                                <button onClick={item.onClick} className={`${(item.disabled && sessionData && ((playerLevel !== null && playerLevel?.Index) < item.disabled.level || sessionData.authName === 'Guest')) ? 'pointer-events-none opacity-80' : ''} block h-auto py-2.5 flex w-full bg-gray-875 rounded-xl bg-opacity-70 hover:bg-gray-850 transition ease-in-out duration-200`}>
                                                    <div className={"flex justify-center pl-0 md:pl-4 lg:pl-6 text-white text-sm lg:text-base uppercase font-bold tracking-tight"}>
                                                        <div className={"w-10"}>
                                                            <FontAwesomeIcon icon={(item.disabled && sessionData && ((playerLevel !== null && playerLevel?.Index) < item.disabled.level || sessionData.authName === 'Guest')) ? faLock : item.icon} className={`${(item.disabled && sessionData && ((playerLevel !== null && playerLevel?.Index) < item.disabled.level || sessionData.authName === 'Guest')) ? 'text-gray-600' : item.color}`} />
                                                        </div>
                                                        <div className={"w-auto"}>
                                                            {(item.disabled && sessionData && ((playerLevel !== null && playerLevel?.Index) < item.disabled.level || sessionData.authName === 'Guest')) ? (
                                                                (sessionData?.authName !== 'Guest' && playerLevel !== null && playerLevel.Index < item.disabled.level) ? 'Level 10' : 'Please Login'
                                                            ) : (
                                                                t(item.name)
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        ))}

                                        {tab.name === 'component.navbar.tournaments' && (
                                            <>
                                                {tournamentData?.map((item) => (item.status !== 2 && item.name.toLowerCase().includes('daily')) && (
                                                    <Link key={item.tournamentId} to={`/competitions/${item.tournamentId}`} className={"flex relative gap-2"}>
                                                        <div className={"w-full px-5 py-3 mr-auto rounded-xl bg-gray-825 hover:bg-gray-850 transition ease-in-out duration-300"}>
                                                            <div className={"text-white text-sm uppercase font-semibold"}>
                                                                {item.name.replace('Daily', '').split('(')[0]}
                                                            </div>
                                                        </div>
                                                        <div className={"hidden lg:block w-24 pl-4 text-orange-400 bg-gray-825 rounded-xl text-left pt-2.5 text-base font-semibold"}>
                                                            <FontAwesomeIcon icon={faUserFriends} className={"mr-1"} />
                                                            {item.totalPlayers.toLocaleString()}
                                                        </div>
                                                    </Link>
                                                ))}
                                                {tournamentData && tournamentData[0] && (
                                                    <div className="bg-gray-825 py-2.5 text-gray-500 font-semibold uppercase rounded-xl text-center">
                                                        <FontAwesomeIcon icon={faClock} className={"mr-1"} /> Ends {moment.unix(tournamentData[0]?.endTime).fromNow()}
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {tab.name === 'page.queue.custom.title' && (
                                            <>
                                                <div className={"px-0 lg:px-6 4xl:px-10 text-center pb-1"}>
                                                    <div className="bg-gray-825 py-2 text-gray-500 font-semibold uppercase rounded-xl">
                                                        <FontAwesomeIcon icon={faUserFriends} className={"mr-1"} /> {lobbiesData.length.toLocaleString()} {t('page.queue.custom.online')}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <RankedModal toggle={() => setShowRankedHelp(!showRankedHelp)} isLoaded={showRankedHelp} />

            <div className={`${(lobbiesLoaded && tab === 1) ? 'opacity-100' : 'pointer-events-none opacity-0'} relative z-50 transition ease-in-out duration-300`}>
                <div className="z-50 fixed bottom-0 left-0 right-0 top-0 w-full h-screen bg-black bg-opacity-80">
                    <div className="flex h-screen">
                        <div className="m-auto h-128 p-4 lg:p-8 w-full md:w-3/4 lg:w-1/2 xl:w-1/3 bg-gray-900 rounded">
                            <div className="flex mb-4 text-lg tracking-wide">
                                <div className="w-auto my-auto">
                                    <div className="uppercase text-white font-semibold">{t('page.queue.custom.public')}</div>
                                </div>
                                <div className="w-auto ml-auto">
                                    <button onClick={() => setTab(0)} className="btn btn--red">
                                        <FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-1" /> Back
                                    </button>
                                </div>
                            </div>
                            <div className="h-96 overflow-y-auto">
                                {lobbiesData.length !== 0
                                    ? lobbiesData.map(row => <LobbiesRow key={row.invite} {...row} />)
                                    : <div className="py-32 w-full bg-black-light text-sm uppercase text-white font-semibold text-center">{t('page.queue.custom.none')}</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Queue;
