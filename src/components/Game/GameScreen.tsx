import {useEffect, useRef, useState} from 'react';
import { useTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import { GlobalHotKeys } from 'react-hotkeys';
import Socket from '../../utils/socket/Socket';
import MatchCountdown from './countdown/MatchCountdown';
import Config from '../../Config';
import CookieService from '../../services/CookieService';
import MatchToast from './MatchToast';
import Player from "./view/Player";
import Spectator from "./view/Spectator";
import {toast} from "react-toastify";
import DebugService from "../../services/DebugService";
import {
    SocketGameEndData,
    SocketMatchData,
    SocketMatchPlayerData
} from "../../types.client.socket";
import Redirect from '../Uncategorized/Redirect';
import Base from '../../templates/Base';
import { Meta } from '../../layout/Meta';
import useConfig from '../../hooks/useConfig';
import { usePlayerContext } from '../../contexts/Player.context';

interface IProps {
    textType?: string;
    embed?: boolean;
    embedClose?: () => void | false;
    embedOwner?: boolean;
}

const GameScreen = (props: IProps) => {

    const { textType, embed, embedClose, embedOwner } = props;
    
    // Core
    const [ socket, setSocket ] = useState<Socket | null>(null);
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    const spectator = useRef<boolean>(false);

    // Intervals
    const gameTimerInterval = useRef<NodeJS.Timer | null>(null);
    
    // Contexts
    const { t } = useTranslation();
    const { matchFinishBeep, upscaleMatchContainer, focusMode, shortcutGameRedo } = useConfig();
    const { sessionData } = usePlayerContext();

    // States
    const [ redirect, setRedirect ] = useState<string>('');
    const [ loaded, setLoaded ] = useState<boolean>(false);
    const [ latency, setLatency ] = useState<number>(0);
    const [ gameToast, setGameToast ] = useState<string>('');
    const [ gameNotice, setGameNotice ] = useState<string>('');
    const [ gameCountdown, setGameCountdown ] = useState<number>(-1);
    const [ gameTimer, setGameTimer ] = useState<number>(-1);
    const [ gameDisabled, setGameDisabled ] = useState<boolean>(true);
    const [ gamePlayers, setGamePlayers ] = useState<number>(0);
    const [ participantsData, setParticipantsData ] = useState<SocketMatchPlayerData[]>([]);
    const [ endMatchData, setEndMatchData ] = useState<SocketGameEndData | null>(null);
    const [ matchData, setMatchData ] = useState<SocketMatchData | null>(null);
    
    // TODO: might need to be re-looked below
    const [ queueRoundEnd, setQueueRoundEnd ] = useState<boolean>(false);
    const [ queueRoundWon, setQueueRoundWon ] = useState<boolean>(false);
    // 
    const [ gameRoundsTotal, setGameRoundsTotal ] = useState<number>(0);

    // Global Hot Keys
    const keyMap = { GOTO_REDO: shortcutGameRedo.toLowerCase() };
    const handlers = { GOTO_REDO: () => (endMatchData && endMatchData.roundData) ? setRedirect(`/play/${textType || 'random'}`) : false };

    // Effects
    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        if (window) {
            DebugService.add('[Match] Server has been called to be initialized');
            setSocket(new Socket(`${Config.gameServer.URL}${Config.gameServer.Port !== null ? `:${Config.gameServer.Port}` : ''}/game`, {
              transports: ['websocket', 'polling'],
            }));

            // Event Listeners
            document.addEventListener('keydown', handleKeydown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeydown);
            if (gameTimerInterval.current) {
                clearInterval(gameTimerInterval.current);
                gameTimerInterval.current = null;
            }
            axiosCancelSource.current?.cancel();
        };
    // eslint-disable-next-line
    }, [ ]);

    useEffect(() => {
        if (typeof window !== 'undefined')
            window.addEventListener('beforeunload', beforeUnload);
        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        }
    // eslint-disable-next-line
    }, [ endMatchData ]);

    // Socket
    useEffect(() => {
        if (!socket) 
            return; 

        if (!loaded) {
            DebugService.add('[Match] Match not joined, joining now...');
            socket.emit('joinMatch', {
                playerToken: CookieService.get('playerToken'),
            });
        }
        
        socket.onError(() => {
            DebugService.add('[Match] onError called');
            socket.emit('disconnect', {});
        });
        socket.onConnect(() => DebugService.add('[Match] Client made handshake with server'));
        socket.onDisconnect((data) => DebugService.add(`[Match] onDisconnect called ${data}`))
        socket.onReconnect(() => DebugService.add('[Match] onReconnect called'));
        socket.onReconnecting(() => DebugService.add('[Match] onReconnecting called'));
        socket.onConnectLost(() => debugAndToast('[Match] onConnectLost called', 'connectionTimedOut'));
        socket.onConnectNotSaved(() => { setGameNotice('reconnectFailed'); DebugService.add('[Match] onConnectNotSaved called') });
        socket.onConnectSaving(() => DebugService.add('[Match] onConnectSaving called'));
        socket.onConnectSaving(() => debugAndToast('[Match] onConnectSaving called', 'connectionSaved'));
        socket.on('getLatency', (data: { latency: number; }) => setLatency(data.latency));
        socket.on('sendLatencyPing', () => socket.emit('sendLatencyPong', {}))
        socket.on('banDetected', () => setGameNotice('banDetected'));
        socket.on('cheatDetected', () => setGameNotice('cheatDetected'));
        socket.on('manyMistakes', () => setGameNotice('manyMistakes'));
        socket.on('timeoutMatch', () => setGameNotice('timeoutMatch'));
        socket.on('achievementUnlocked', (data: { message: string; }) => data.message ? toast.success(data.message) : false);
        socket.on('levelUp', (data: { level: string; }) => data.level ? toast.success(`You have ranked up to Level ${data.level}!`) : false);
        socket.on('forceEndMatch', () => socket.emit('sendWord', { forceEnd: 1 }));
        socket.on('globalForceEnd', (data: { type: string }) => socket.emit('globalForceEnd', data));

        // Match Fetching
        socket.on('matchNotFound', () => {
            DebugService.add('[Match] Data could not be received, player not in game');
            toast.error("Unable to find match, try again later!");
            setRedirect('/');
        });
        socket.on('getMatch', (data: SocketMatchData) => {
            DebugService.add('[Match] Data has been received');
            setMatchData(data); 
            setLoaded(true);
        });

        socket.on('endMatch', (data: SocketGameEndData) => {
            DebugService.add('[Match] Match has been successfully ended.');
            playSound();

            if (gameTimer && gameTimerInterval.current) {
                clearInterval(gameTimerInterval.current);
                gameTimerInterval.current = null;
            }

            setGameDisabled(true);
            setGameCountdown(-1);
            setEndMatchData({ ...data });
        });

        // Timers
        socket.on('sendTimer', (data: { timer: number; }) => {
            DebugService.add('[Match] Timer has been sent and initialized');
            if (!gameTimerInterval.current) {
                let newTimer = data.timer;
                gameTimerInterval.current = setInterval(() => {
                    if (newTimer > 0) {
                        setGameTimer(newTimer);
                        newTimer--;
                    } else {
                        setGameTimer(-1);
                        if (gameTimerInterval.current) {
                            clearInterval(gameTimerInterval.current);
                            gameTimerInterval.current = null;
                        }
                    }
                }, 1000);
            }
        });

        socket.on('sendCountdown', (data: { countdown: number }) => {
            DebugService.add('[Match] Countdown timer has been sent');
            const roundedTimer = Math.round(data.countdown);

            if (roundedTimer < 1) {
                setQueueRoundEnd(false);
                setQueueRoundWon(false);
                setGameDisabled(false);
            }
            setGameCountdown(roundedTimer);
        });

        socket.on('updateRound', (data: { userRoundWon: string; textContent: string; roundsTotal: number }) => {
            DebugService.add('[Match] Ranked round has been updated');
            DebugService.add(`[Match] Ranked Text (old): ${matchData?.textContent}`);
            DebugService.add(`[Match] Ranked Text (new): ${data.textContent}`);

            setMatchData((matchData) => matchData !== null ? { ...matchData, textContent: data.textContent, textCustom: data.textContent } : null);
            setQueueRoundEnd(true);
            setQueueRoundWon((sessionData?.playerId === data.userRoundWon));
            setGameDisabled(true);
            setGameRoundsTotal(data.roundsTotal);

            setParticipantsData((participants) => {
                participants.map((item) => {
                    item.currentWord = data.textContent.split(' ')[0] || '';
                    item.currentKeystroke = data.textContent.charAt(0) || '';
                    item.Progress = 0;
                    item.WPM = 0;
                    item.Accuracy = 0;
                    item.wordLetterIndex = 0;
                    item.correctWords = 0;
                    item.correctKeystrokeString = '';
                    item.currentInput = '';
                    item.Quit = 0;
                    item.Placement = 0;
                    item.PlacementFinal = 0;
                });

                return [ ...participants ];
            });
        });

        // Players 
        socket.on('updatePlayers', (data: SocketMatchPlayerData[]) => {
            if (!data)
                toast.error("updatePlayers unable to fetch players!");
            else {
                DebugService.add('[Match] Players have been fetched');
                let i:number; const dataLength = data.length;
                for (i = 0; i < dataLength; i++) {
                    /* @ts-ignore */ 
                    if (data[i].playerId === sessionData.playerId && data[i].teamId === 0) 
                        spectator.current = true;
                }
                setGamePlayers(dataLength || 0);
                setParticipantsData([ ...data ]);
            } 
        });

        socket.on('updateWPM', (data: SocketMatchPlayerData) => {
            if (data.spectatorOnly && !spectator.current)
                return;

            setParticipantsData((participantsData) => {
                let i;
                const pLength = participantsData ? participantsData.length : 0;
                for (i = 0; i < pLength; i++) {
                    const participantData = participantsData[i];
                    if (participantData && participantData.playerId === data.playerId) {
                        if (data.currentWord) participantData.currentWord = data.currentWord;
                        if (data.WPM) participantData.WPM = data.WPM;
                        if (data.Progress) participantData.Progress = data.Progress;
                        if (data.Quit) participantData.Quit = data.Quit;
                        if (data.roundsWon) participantData.roundsWon = data.roundsWon;
                        if (data.Placement) participantData.Placement = data.Placement;
                        if (data.PlacementFinal) participantData.PlacementFinal = data.PlacementFinal;
                        if (data.wordLetterIndex) participantData.wordLetterIndex = data.wordLetterIndex;
                        if (data.correctWords) participantData.correctWords = data.correctWords;
                        if (data.Accuracy) participantData.Accuracy = data.Accuracy;
                        if (typeof data.currentInput !== 'undefined') participantData.currentInput = data.currentInput;
                    }
                }
                return [ ...participantsData ];
            })
        });

        return () => { 
            socket.disconnect();
            setSocket(null);
        };
    // eslint-disable-next-line
    }, [ socket, sessionData?.playerId ]);

    // Methods
    const sendKeystroke = (keystroke: string, event: boolean): void => socket?.emit('sendKeystroke', {
        keystroke,
        event
    });

    const playSound = () => {
        DebugService.add('[Match] Played Level Completed audio queue');
        if (document.getElementById('LevelCompleted') && matchFinishBeep === '1') {
            // @ts-ignore
            document.getElementById('LevelCompleted').play();
        }
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if ( (e.key === 's' && e.ctrlKey) )
            e.preventDefault();

        if (!endMatchData && gameCountdown >= 1 && e.key === 'Backspace') 
            e.preventDefault();
    }

    const beforeUnload = (e: BeforeUnloadEvent) => {
        console.log('endMatchData', endMatchData);
        if (!endMatchData || !endMatchData.roundData) {
            e.preventDefault();
            e.returnValue = true;
        }
    }

    const debugAndToast = (debug: string, message: string) => {
        DebugService.add(debug);
        setGameToast(message);
    }

    // Rendering
    const matchContainerCSS = (upscaleMatchContainer === '1' && !spectator.current) ? 'container-small' : 'container-game';

    let 
        noticeString = '',
        firstWord = '';

    const 
        quoteString = (matchData?.textCustom && matchData.textCustom !== '' ? matchData.textCustom : matchData?.textContent) || '',
        leaveUrl = matchData?.flagId !== 3 ? (matchData?.referralId ? `/` : matchData?.tournamentId !== '' ? `/competitions/${matchData?.tournamentId}` : `/`) : `/`,
        restartUrl = matchData?.flagId !== 3 ? matchData?.referralId ? `/custom/${matchData?.referralId}` : matchData?.tournamentId !== '' ? `/competitions/${matchData?.tournamentId}/`  : `/play${textType ? `/${textType}` : ''}`  : '/';

    if (gameNotice === 'banDetected')
        noticeString = "Your account is currently banned, please contact support.";
    else if (gameNotice === 'cheatDetected')
        noticeString = "Your match has been flagged and is being reviewed."
    else if (gameNotice === 'manyMistakes')
        noticeString = "You have made too many mistakes!"
    else if (gameNotice === 'timeoutMatch')
        noticeString = "You have run out of time to complete the game. Better luck next time!"
    else if (gameNotice === 'reconnectFailed')
        noticeString = "We have failed to reconnect you back to the game."

    if (matchData?.flagId === 2 && matchData.referralId && noticeString === 'timeoutMatch') return <Redirect to={`/custom/${matchData.referralId}`} />;
    if (matchData?.flagId === 1 && matchData.tournamentId && noticeString === 'timeoutMatch') return <Redirect to={`/competitions/${matchData.tournamentId}`} />;
    firstWord = quoteString.split(' ')[0] || '';

    const gameContainer = (
        <>
            <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
            <audio id="LevelCompleted" src="/audio/LevelCompleted.wav" crossOrigin="anonymous" preload="auto" />
            <audio id="CountBeep" src="/audio/CountBeep.wav" crossOrigin="anonymous" preload="auto" />
            <audio id="CountStart" src="/audio/CountStart.wav" crossOrigin="anonymous" preload="auto" />
            {matchData && gameCountdown !== -1 && <MatchCountdown url={matchData.referralId ? restartUrl : leaveUrl} isSpectator={spectator.current} isDisabled={gameDisabled} countdown={gameCountdown} win={queueRoundWon} roundEnd={queueRoundEnd} />}
            <MatchToast isReconnecting={gameToast === 'connectionSaved'} isConnectionLost={gameToast === 'connectionTimedOut'} />
            <div className={`${matchContainerCSS ?? 'container-small'} pt-10`}>
                {!spectator.current ? (
                    <>
                        {(focusMode === '1' && (!endMatchData || (endMatchData && !endMatchData.roundData))) && <div className={"fixed z-50 top-0 right-0 bottom-0 left-0 bg-gray-900 bg-opacity-50 w-full h-screen"} />}
                        <div className={`relative ${focusMode === '1' ? 'z-50' : 'z-20'} flex ${endMatchData && endMatchData.roundData && endMatchData.roundData.length !== 0 ? 'h-auto container-margin' : `h-auto lg:h-game container-padding`}`}>
                            <Player embed={embed || false} embedClose={embedClose} embedOwner={embedOwner} totalPlayers={gamePlayers} translation={t('page.match.statistics_unsaved')} firstWord={firstWord} sendKeystroke={sendKeystroke} playerData={sessionData} countdown={gameCountdown} timer={gameTimer} disabled={gameDisabled} latency={latency} quoteString={quoteString} endMatch={endMatchData !== null} endMatchData={endMatchData as SocketGameEndData} leaveUrl={leaveUrl} matchData={matchData} participantsData={participantsData} noticeString={noticeString} restartUrl={restartUrl} roundsTotal={gameRoundsTotal} />
                        </div>
                    </>
                ) : (
                    <div className={`flex py-6 h-auto lg:h-nav`}>
                        <Spectator embedClose={embedClose} embedOwner={embedOwner} translation={t('page.match.statistics_unsaved')} totalPlayers={gamePlayers} firstWord={firstWord} countdown={gameCountdown} timer={gameTimer} quoteString={quoteString} leaveUrl={leaveUrl} matchData={matchData} participantsData={participantsData} noticeString={noticeString} restartUrl={restartUrl} roundsTotal={gameRoundsTotal} />
                    </div>
                )}
            </div>
        </>
    )

    if (redirect && redirect !== '')
        return <Redirect to={redirect} />;
    else
        return !embed ? (
            <Base meta={<Meta title="In Game" />} isLoaded={(matchData !== null && sessionData !== null)} ads={{ enableTrendiVideo: (focusMode === '0') }}>
                {gameContainer}
            </Base>
        ) : (
            <div>
                {gameContainer}
            </div>
        );
}

export default GameScreen;
