import {FC, useState, createContext, useContext, useEffect, useRef} from 'react';
import axios, { CancelTokenSource } from "axios";
import Config from "../Config";
import {AuthenticationSessionData} from "../types.client.mongo";
import {toast} from "react-toastify";

interface ContextType {
    sessionData: AuthenticationSessionData | null;
    setSessionData: (user: AuthenticationSessionData | null) => void;
    isGuest: boolean;
    setIsGuest: (userAuth: boolean) => void;
    isPatreon: boolean;
    setIsPatreon: (v: boolean) => void;
}

export const PlayerContext = createContext<ContextType | null>(null);

export const PlayerProvider: FC = ({ children }) => {
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);

    const [ sessionData, setSessionData ] = useState<AuthenticationSessionData | null>(null);
    const [ isGuest, setIsGuest ] = useState(false);
    const [ isPatreon, setIsPatreon ] = useState(false);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();

        async function getSession() {
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
                toast.error(`Keyma.sh version mismatch detected, please clear your cache!`);
                console.log(`[SERVER MISMATCH WITH CLIENT] Server v${data.versionControl} - Client v${Config.versionControl}`);
            }

        }
        getSession().then();
        return () => axiosCancelSource.current?.cancel();
    }, []);

    return <PlayerContext.Provider value={{ sessionData, setSessionData, isGuest, setIsGuest, isPatreon, setIsPatreon }}>
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
