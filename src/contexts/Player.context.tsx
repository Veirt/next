import {FC, useState, createContext, useContext, useEffect, useRef, useCallback} from 'react';
import axios, { CancelTokenSource } from "axios";
import Config from "../Config";
import {AuthenticationSessionData, PlayerNotificationData} from "../types.client.mongo";
import {toast} from "react-toastify";
import Socket from '../utils/socket/Socket';
import usePlayerToken from '../hooks/usePlayerToken';

interface ContextType {
    sessionData: AuthenticationSessionData | null;
    setSessionData: (user: AuthenticationSessionData | null) => void;
    isGuest: boolean;
    setIsGuest: (userAuth: boolean) => void;
    isPatreon: boolean;
    setIsPatreon: (v: boolean) => void;
    getSessionData: () => void;

    // Queue Functionality
    inQueue?: boolean;
    setInQueue: (v: boolean) => void;
    queueFound?: boolean;
    setQueueFound: (v: boolean) => void;
    queueTimer: number;

    // Notification Functionality
    notificationData: PlayerNotificationData[] | null;
    notificationCount: number;
    deleteNotifications: () => void;
    readNotifications: () => void;
}

export const PlayerContext = createContext<ContextType | null>(null);

export const PlayerProvider: FC = ({ children }) => {
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);

    const { playerToken } = usePlayerToken();
    const [ sessionData, setSessionData ] = useState<AuthenticationSessionData | null>(null);
    const [ isGuest, setIsGuest ] = useState(false);
    const [ isPatreon, setIsPatreon ] = useState(false);
    const [ inQueue, setInQueue ] = useState(false);

    // Notification Socket
    const [ notifySocket, setNotifySocket ] = useState<Socket | null>(null);
    const [ notificationData, setNotificationData ] = useState<PlayerNotificationData[] | null>(null);
    const [ notificationCount, setNotificationCount ] = useState(0);

    // Queue Socket
    const [ queueSocket, setQueueSocket ] = useState<Socket | null>(null);
    const [ queueTimer, setQueueTimer ] = useState<number>(0);
    const [ queueFound, setQueueFound ] = useState<boolean>(false);

    const getSessionData = useCallback(async () => {
        const response = await axios.get(`${Config.authUrl}/session`, {
            withCredentials: true,
            cancelToken: axiosCancelSource.current?.token,
        });
        const data = await response.data;
        const getData = data.data;
        setSessionData(getData);

        if (getData.patreon || getData.staff)
            setIsPatreon(true);

        if (getData.authName && getData.authName === 'Guest')
            setIsGuest(true);

        if (data.versionControl !== Config.versionControl) {
            toast.error(`Keymash version mismatch detected, please clear your cache!`);
            console.log(`[SERVER MISMATCH WITH CLIENT] Server v${data.versionControl} - Client v${Config.versionControl}`);
        }
    }, []);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        getSessionData();
        return () => axiosCancelSource.current?.cancel();
    }, [ getSessionData ]);

    // Notification Socket
    useEffect(() => {
        if (sessionData !== null && playerToken) {
            if (!notifySocket) {
                console.log('Start Notification Socket');
                setNotifySocket(new Socket(`${Config.gameServer.URL}${Config.gameServer.Port !== null ? `:${Config.gameServer.Port}` : ''}/account`, {
                    transports: ['websocket', 'polling'],
                }));
            }
        }
    }, [ sessionData, playerToken, notifySocket ]);

    useEffect(() => {
        if (!notifySocket || !playerToken || !sessionData)
            return;

        notifySocket?.onError(() => console.log('[NotificationSocket] OnError'));
        notifySocket?.onDisconnect(() => console.log('[NotificationSocket] OnDisconnect'));
        notifySocket?.onConnect(() => {
            console.log('Notification Socket Connceted');
            notifySocket?.emit('joinNotifications', { playerToken });
            notifySocket?.on('updateNotifications', async (data: { unread: number, data: PlayerNotificationData[] }) => {
                setNotificationData(data.data);
                setNotificationCount(data.unread);
            });
        });
        return () => {
            notifySocket?.disconnect();
            setNotifySocket(null);
        }
    }, [ sessionData, playerToken, notifySocket ]);

    const deleteNotifications = async () => notifySocket?.emit('deleteNotifications', {});
    const readNotifications = async () => notifySocket?.emit('readNotifications', {});
    
    // Queue Socket
    useEffect(() => {
        let startMatchMakingInterval: NodeJS.Timeout | null = null;

        if (sessionData !== null && playerToken) {
            if (!queueSocket && inQueue) {
                console.log('Start Matchmaking Socket');
                startMatchMakingInterval = setTimeout(() => {
                    setQueueSocket(new Socket(`${Config.gameServer.URL}${Config.gameServer.Port !== null ? `:${Config.gameServer.Port}` : ''}/queue`, {
                        transports: ['websocket', 'polling'],
                    }));
                }, 100);
            }

            if (!inQueue && queueSocket) {
                queueSocket?.disconnect();
                setQueueFound(false);
                setQueueTimer(0);
                setQueueSocket(null);
            }
        }

        return () => {
            if (startMatchMakingInterval)
                clearTimeout(startMatchMakingInterval);
        }
    }, [ sessionData, playerToken, inQueue, queueSocket ]);
    
    useEffect(() => {
        if (!queueSocket || !playerToken || !sessionData)
            return;

        let intervalQueue: NodeJS.Timer | null = null;
        queueSocket?.onError(() => {
            setInQueue(false);
            if (intervalQueue)
                clearInterval(intervalQueue);
        });

        queueSocket?.onDisconnect(() => {
            setInQueue(false);
            if (intervalQueue)
                clearInterval(intervalQueue);
        });
        queueSocket?.onConnect(() => {
            console.log('Matchmaking Socket Connceted');
            queueSocket?.emit('joinQueue', { playerToken });

            queueSocket?.on('isBanned', (data: { message: string }) => toast.error(data.message));
            queueSocket?.on('isCooldown', (data: { message: string }) => toast.error(data.message));

            queueSocket?.on('startQueue', () => {
                if (!intervalQueue)
                    intervalQueue = setInterval(() => setQueueTimer(q => (q + 1)), 1000);
            });

            queueSocket?.on('foundQueue', (data: { playersFound: string[] }) => {
                const array = data.playersFound;
                if (sessionData && array.includes(sessionData.playerId)) 
                    setQueueFound(array.includes(sessionData.playerId));
            });
        });
        return () => {
            queueSocket?.disconnect();
            setQueueSocket(null);
        }
    }, [ sessionData, playerToken, queueSocket ]);

    return <PlayerContext.Provider value={{ 
            sessionData, 
            setSessionData, 
            isGuest, 
            setIsGuest, 
            isPatreon, 
            setIsPatreon, 
            getSessionData,

            // Queue Functionality
            inQueue, 
            setInQueue, 
            queueFound,
            setQueueFound,
            queueTimer,

            // Notification Functionality
            notificationData,
            notificationCount,
            deleteNotifications,
            readNotifications
        }}>
        {children}
    </PlayerContext.Provider>;
}

export const usePlayerContext = (): ContextType => {
    const context = useContext(PlayerContext);

    if (context == null) {
        throw new Error('usePlayerContext must be used within a PlayerProvider');
    }

    return context;
}
