import {FC, useEffect, useRef, useState} from "react";
import { useTranslation } from 'next-i18next';
import MatchMode from "../MatchMode";
import {faQuestion, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SocketMatchData, SocketMatchPlayerData} from "../../../types.client.socket";
import Playerboard from "../participants/Playerboard";
import useConfig from "../../../hooks/useConfig";
import Modal from "../../Uncategorized/Modal";

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
                                const caretAnimation = getUserCaret.animate({ marginLeft: `${offsetLeft - 2}px` }, { duration: parseInt(smoothCaretSpeed, 10) });
                                caretAnimation.onfinish = () => { getUserCaret.style.marginLeft = `${offsetLeft - 2}px`; getUserCaret.style.marginTop = `${offsetTop}px`; }
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
            <>
                <Modal isOpened={showHelp} onClose={() => setShowHelp(false)}>
                    <div>
                        <div className={"text-xl uppercase font-semibold tracking-wider pb-3 mb-3 border-b border-orange-400"}>{t('component.spectator.help_title')}</div>
                        <div className={"text-gray-300"}>
                            <div className={"pb-2"}>{t('component.spectator.help_1')}</div>
                            <div className={"pb-2"}>{t('component.spectator.help_2')}</div>
                            <div className={"pb-2"}>{t('component.spectator.help_3')}</div>
                            <div className={"pb-2"}>{t('component.spectator.help_4')}</div>
                        </div>
                        <button onClick={() => setShowHelp(false)} className={"button small orange mt-4"}>
                            {t('button.close')}
                        </button>
                    </div>
                </Modal>
                <div className={"absolute w-16 top-20 right-0 left-2"}>
                    {embedOwner && (
                        <button type={"button"} onClick={embedClose} data-tip="Close" className={"block bg-black bg-opacity-50 hover:bg-opacity-70 w-12 text-center py-3 rounded-xl"}>
                            <FontAwesomeIcon icon={faTimes} className={"text-pink-500 text-xl"}/>
                        </button>
                    )}

                    <button onClick={() => setShowHelp(true)} className={"mt-2 block bg-black bg-opacity-50 hover:bg-opacity-70 w-12 text-center py-3 rounded-xl"}>
                        <FontAwesomeIcon icon={faQuestion} className={"text-white text-xl"}/>
                    </button>
                </div>
                <div className="container-smaller container-margin">
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
                                <div className={"relative"} style={{ lineHeight: '2.5' }}>
                                    {participantsData.map((participant, x) => (participant.teamId !== 0 && (participant.Progress ? participant.Progress : 0) < 100) && (
                                        <div key={`key${participant.playerId}`} id={`${participant.playerId}`} className="absolute" style={{ marginLeft: '0px', marginTop: '0px', }}>
                                            <div className="absolute -top-4 z-10 bg-gray-600 bg-opacity-40 text-gray-200 shadow-sm px-1.5 py-0.5 text-xs rounded-lg">
                                                {participant.name}
                                            </div>
                                            <div
                                                className={`rounded ${caretColors[x]}`}
                                                style={{ width: '2px', height: charHeight || '2px', transform: 'scale(1.1)' }}
                                            />
                                        </div>
                                    ))}
                                    {newQuote.split('').map((item, key) => (
                                        <span key={key} className={`cursor--locate pr-px`}>
                                            {item === ' ' ? <span className={"pr-2"}> </span> : item}
                                        </span>
                                    ))}
                                </div>

                            </div>
                        </>
                    )}
                    <div className={"flex flex-wrap uppercase text-gray-500 pb-1 font-semibold text-xs tracking-wider"}>
                        <div className={"w-auto ml-auto"} />
                        <div className={"ml-auto hidden lg:block w-2/4 md:w-80"} />
                        <div className={"hidden lg:block text-right w-24 pr-3"}>
                            Accuracy
                        </div>
                        <div className={"text-right w-32 pr-3"}>
                            Speed
                        </div>
                    </div>
                    {matchData 
                        && <Playerboard isSpectator={1} quoteString={quoteString} borderColors={borderColors} participantsData={participantsData} firstWord={firstWord} modeId={matchData.modeId} roundLimit={matchData.modeData.modeConfig.ROUNDS.FIRST} />
                    }
                </div>
            </>
        )
}

export default Spectator;
