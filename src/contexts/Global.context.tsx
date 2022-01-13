import {FC, useState, createContext, useContext, useEffect, useRef, useCallback} from 'react';
import axios, { CancelTokenSource } from "axios";
import Config from "../Config";

interface GlobalAnnouncement {
    key: string;
    value: string;
    url?: string;
}

interface ContextType {
    announcement: GlobalAnnouncement
}

export const GlobalContext = createContext<ContextType | null>(null);

export const GlobalProvider: FC = ({ children }) => {
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);

    const [ announcement, setAnnouncement ] = useState<GlobalAnnouncement>({
        key: "",
        value: "",
        url: "",
    })

    const getGlobalData = useCallback(async (key: string) => {
        const response = await axios.get(`${Config.gameUrl}/globals?key=${key}`, {
            withCredentials: true,
            cancelToken: axiosCancelSource.current?.token,
        });
        const data = await response.data;
        return data ? data : null;
    }, []);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        getGlobalData("announcement")
            .then((r) => setAnnouncement((announcement) => r || announcement))
            .catch((e) => console.log(e));

        return () => axiosCancelSource.current?.cancel();
    }, [ getGlobalData ]);

    return <GlobalContext.Provider value={{ announcement }}>
        {children}
    </GlobalContext.Provider>;
}

export const useGlobalContext = (): ContextType => {
    const context = useContext(GlobalContext);

    if (context == null) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }

    return context;
}
