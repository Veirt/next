import {FC, useState, createContext, useContext} from 'react';

interface ContextType {
    toggleChat: boolean;
    setToggleChat: (toggleChat: boolean) => void;
}

export const ChatContext = createContext<ContextType | null>(null);

export const ChatProvider: FC = ({ children }) => {

    const [ toggleChat, setToggleChat ] = useState(false);

    return <ChatContext.Provider value={{ toggleChat, setToggleChat }}>
        {children}
    </ChatContext.Provider>;
}

export const useChatContext = (): ContextType => {
    const context = useContext(ChatContext);

    if (context == null) {
        throw new Error('useChatContext must be used within a UserProvider');
    }

    return context;
}
