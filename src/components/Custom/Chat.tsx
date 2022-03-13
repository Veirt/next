import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";
import { ChangeEvent, KeyboardEvent } from "react";
import { SocketCustomChatData } from "../../types.client.socket";
import PlayerAvatar from "../Player/PlayerAvatar";
import PlayerName from "../Player/PlayerName";

interface IProps {
    chatData: SocketCustomChatData[];
    typingData: string[];
    message: string;

    chatOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
    chatOnKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;

}

const Chat = (props: IProps) => {

    const { chatData, typingData, message, chatOnChange, chatOnKeyDown } = props;
    const { t } = useTranslation();

    const messageCSS = "bg-gray-775 rounded-lg py-2 px-4";

    return (
        <div className="content-box">
            <div id="chatbox" style={{ overflowY: 'auto', height: '50vh' }}>
                <div className="pb-2 text-gray-300 text-white tracking-wide text-sm lg:text-base">{t('page.custom.chat')}</div>
                {chatData && chatData.map((row, key) => (
                    <div key={key} className="text-white pb-1 text-sm lg:text-base break-all">
                        {row.type === 'message'
                            ? (
                                <div className={`flex ${messageCSS}`}>
                                    <div className={"w-10 h-10 my-auto"}>
                                        <PlayerAvatar source={row.avatarSrc} color={row.cardBorder} />
                                    </div>
                                    <div className={"my-auto w-full pl-3"}>
                                        <div className={"text-base font-semibold flex"}>
                                            <PlayerName name={row.name} discriminator={row.discriminator} verified={row.verified} patreon={row.patreon} staff={row.staff} showDiscriminator />
                                            <div className={"my-auto ml-2 text-xs text-gray-600 font-semibold"}>{row.posted}</div>
                                        </div>
                                        <div className={"text-gray-400 text-sm -mt-1"}>{row.message}</div>
                                    </div>
                                </div>
                            )
                            : ( <div className={`${messageCSS} font-semibold text-orange-400`}><FontAwesomeIcon icon={faAngleDoubleRight} className={"mr-1"} /> {row.message}</div>)
                        }
                    </div>
                ))}
            </div>
            <div className={"text-gray-400 font-semibold h-3 text-xs"}>
                {typingData.length !== 0 && (
                    typingData.length === 1
                        ? `${typingData[0]} is`
                        : typingData.length === 2
                        ? `${typingData[0]} and ${typingData[1]} are`
                        : typingData.length === 3
                            ? `${typingData[0]}, ${typingData[1]} and ${typingData[2]} are`
                            : `Several people are`
                )}
                {typingData.length !== 0 && ' typing...'}
            </div>
            <div className={"mt-2"}>
                <input type="text" name="message" className="form-settings rounded-lg" placeholder={t('form.message')} value={message || ''} autoComplete="off" onChange={chatOnChange} onKeyDown={chatOnKeyDown} />
            </div>
        </div>
    );
}

export default Chat;