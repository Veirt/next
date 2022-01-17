import {FC, useEffect, useRef, useState} from "react";
import { useTranslation } from 'next-i18next';
import MatchMode from "../MatchMode";
import {faQuestion, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SocketMatchData, SocketMatchPlayerData} from "../../../types.client.socket";
import Playerboard from "../participants/Playerboard";
import useConfig from "../../../hooks/useConfig";

interface IProps {
    matchData: SocketMatchData | null;
    participantsData: SocketMatchPlayerData[];
    timer: number;
    countdown: number;
    restartUrl: string;
    leaveUrl: string;
    firstWord: string;
    totalPlayers: number;
    noticeString: string;
    roundsTotal: number;
    quoteString: string;
    translation: string;
    embedClose?: () => void | false;
    embedOwner?: boolean;
}

const Spectator: FC<IProps> = (props) => {
    const caretTimer = useRef<NodeJS.Timer | null>(null);

    const { smoothCaret, smoothCaretSpeed } = useConfig();

    const [ charHeight, setCharHeight ] = useState('0px');
    const [ showHelp, setShowHelp ] = useState(false);
    const { timer, countdown, embedClose, embedOwner, firstWord, totalPlayers, quoteString, roundsTotal, matchData, participantsData } = props;
    const { t } = useTranslation();

    const newQuote:string = (quoteString && quoteString !== "KEYMASH_GAMEMODE_ROUND_END" ? quoteString : "");
    const borderColors = [ 'border-orange-400', 'border-green-400', 'border-blue-400', 'border-purple-400', 'border-teal-400', 'border-pink-400', 'border-indigo-400', 'border-gray-400', 'border-gray-400', 'border-gray-400', 'border-gray-400', 'border-gray-400', 'border-gray-400', 'border-gray-400', 'border-gray-400', 'border-gray-400' ];
    const caretColors = [ 'bg-orange-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-teal-400', 'bg-pink-400', 'bg-indigo-400', 'bg-gray-400', 'bg-gray-400', 'bg-gray-400', 'bg-gray-400', 'bg-gray-400', 'bg-gray-400', 'bg-gray-400', 'bg-gray-400', 'bg-gray-400' ];

    useEffect(() => setCharHeight(`${(document.getElementsByClassName('cursor--locate')[0] as HTMLDivElement)?.offsetHeight}px`), [ quoteString ]);
    useEffect(() => {
        if (!caretTimer.current) {
            caretTimer.current = setInterval(() => {
                const participantsLength = participantsData.length;
                let i:number;

                for (i = 0; i < participantsLength; i++) {
                    if (participantsData[i] && participantsData[i]?.playerId) {
                        const correctKeystrokes = (participantsData[i]?.correctKeystrokes ? participantsData[i]?.correctKeystrokes : 0);
                        const getUserCaret:HTMLElement | null = document.getElementById(String(participantsData[i]?.playerId));
                        const getCaretPosition = (document.getElementsByClassName('cursor--locate')[correctKeystrokes ? correctKeystrokes : 0] as HTMLElement);

                        if (getCaretPosition && getUserCaret) {
                            const { offsetLeft, offsetTop } = getCaretPosition;

                            if (smoothCaret === '1') {
                                const caretAnimation = getUserCaret.animate({ marginLeft: `${offsetLeft - 1}px` }, { duration: parseInt(smoothCaretSpeed, 10) });
                                caretAnimation.onfinish = () => { getUserCaret.style.marginLeft = `${offsetLeft - 1}px`; getUserCaret.style.marginTop = `${offsetTop}px`; }
                            } else {
                                getUserCaret.style.marginLeft = `${offsetLeft - 1}px`;
                                getUserCaret.style.marginTop = `${offsetTop}px`;
                            }
                        }
                    }
                }
            }, 17);
        }

        return () => {
            if (caretTimer.current !== null) {
                clearInterval(caretTimer.current);
                caretTimer.current = null;
            }
        }
    }, [ participantsData, smoothCaret, smoothCaretSpeed ]);

    if (!matchData)
        return <div>No data found</div>
    else
        return (
            <div className="mt-10 w-full px-2">
                {showHelp && (
                    <div className={"fixed top-0 bottom-0 right-0 left-0 w-screen h-screen bg-black bg-opacity-70"}>
                        <div className={"flex h-screen"}>
                            <div className={"flex m-auto"}>
                                <div className={"w-128 bg-gray-775 p-4 text-white"}>
                                    <div>
                                        <div className={"text-xl uppercase font-semibold tracking-wider pb-3 mb-3 border-b border-orange-400"}>{t('component.spectator.help_title')}</div>
                                        <div className={"text-gray-300"}>
                                            <div className={"pb-2"}>{t('component.spectator.help_1')}</div>
                                            <div className={"pb-2"}>{t('component.spectator.help_2')}</div>
                                            <div className={"pb-2"}>{t('component.spectator.help_3')}</div>
                                            <div className={"pb-2"}>{t('component.spectator.help_4')}</div>
                                        </div>
                                        <button onClick={() => setShowHelp(false)} className={"btn btn--red mt-2"}>
                                            {t('button.close')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={"absolute w-16 h-screen top-24 bottom-0 right-0 left-0"}>
                    {embedOwner && (
                        <button type={"button"} onClick={embedClose} className={"block bg-black bg-opacity-50 hover:bg-opacity-70 w-16 text-center py-4 rounded-r"}>
                            <FontAwesomeIcon icon={faTimes} className={"text-pink-500 text-2xl mr-2"}/>
                        </button>
                    )}
                </div>
                <div className={"absolute w-16 h-screen top-24 bottom-0 right-0"}>
                    <button onClick={() => setShowHelp(true)} className={"block bg-black bg-opacity-50 hover:bg-opacity-70 w-16 text-center py-4 rounded-l"}>
                        <FontAwesomeIcon icon={faQuestion} className={"text-white text-2xl mr-1"}/>
                    </button>
                </div>
                <div className={"max-w-screen-lg mx-auto"}>
                    <MatchMode
                        totalPlayers={totalPlayers}
                        matchData={matchData}
                        roundsTotal={roundsTotal}
                        timer={timer}
                        countdown={countdown}
                        isSpectate={true}
                    />
                    {quoteString && quoteString !== "KEYMASH_GAMEMODE_ROUND_END" && (
                        <>
                            <div className={"break-words mb-6 match--container text-gray-200 text-xl rounded-t-xl"}>
                                <div className={"relative"}>
                                    {participantsData.map((participant, x) => (participant.teamId !== 0 && (participant.Progress ? participant.Progress : 0) < 100) && (
                                        <div
                                            key={`key${participant.playerId}`}
                                            id={`${participant.playerId}`}
                                            className={`absolute rounded ${caretColors[x]}`}
                                            style={{ width: '2px', height: charHeight || '2px', marginLeft: '0px', marginTop: '0px', transform: 'scale(1.1)' }}
                                        />
                                    ))}
                                    {newQuote.split('').map((item, key) => (
                                        <span key={key} className={`cursor--locate my-1 pr-px`}>
                                            {item === ' ' ? <span className={"pr-2"}> </span> : item}
                                        </span>
                                    ))}
                                </div>

                            </div>
                        </>
                    )}
                    <div className={"hidden md:flex flex-wrap uppercase text-gray-500 pb-1 font-semibold text-xs tracking-wider"}>
                        <div className={"w-1/2 md:w-64"} />
                        <div className={"w-1/2 md:w-auto mr-auto"} />
                        <div className={"w-2/4 md:w-80"} />
                        <div className={"w-1/4 text-right md:w-24 pr-3"}>
                            Acc %
                        </div>
                        <div className={"w-1/4 text-right md:w-32 pr-3"}>
                            Speed
                        </div>
                    </div>
                    {matchData && (
                        <>
                            <Playerboard isSpectator={1} quoteString={quoteString} borderColors={borderColors} participantsData={participantsData} firstWord={firstWord} modeId={matchData.modeId} roundLimit={matchData.modeData.modeConfig.ROUND_FIRST} />
                        </>
                    )}
                </div>
            </div>
        )
}

export default Spectator;
