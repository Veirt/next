import React, {Component, FC, useEffect} from 'react';
import { withTranslation, WithTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import { GlobalHotKeys } from 'react-hotkeys';
import Socket from '../../utils/socket/Socket';
import MatchCountdown from '../../components/Game/countdown/MatchCountdown';
import Config from '../../Config';
import CookieService from '../../services/CookieService';
import MatchToast from '../../components/Game/MatchToast';
import Player from "./view/Player";
import Spectator from "./view/Spectator";
import {toast} from "react-toastify";
import DebugService from "../../services/DebugService";
import {useChatContext} from "../../contexts/Chat.context";
import ConfigService from "../../services/ConfigService";
import {AuthenticationSessionData} from "../../types.client.mongo";
import {
    SocketMatchData,
    SocketMatchEndData,
    SocketMatchGameData,
    SocketMatchPlayerData
} from "../../types.client.socket";
import Redirect from '../../components/Uncategorized/Redirect';
import Base from '../../templates/Base';
import { Meta } from '../../layout/Meta';
import SidebarSquare from '../Advertisement/SidebarSquare';
import SidebarLong from '../Advertisement/SidebarLong';

interface IState {
    matchLoaded: boolean;
    matchData: SocketMatchData;
    gameData: SocketMatchGameData;
    participantsData: SocketMatchPlayerData[];
    endMatchData: SocketMatchEndData;
    roundsTotal: number;
    achievementString: string;
    showRound: number;
    queueRoundEnd: boolean;
    queueRoundWon: boolean;
    redirect: string;
}

interface IProps extends WithTranslation {
    textType?: string;
    embed?: boolean;
    embedClose?: () => void | false;
    embedOwner?: boolean;
}

const CloseChat:FC = () => {
    const { setToggleChat } = useChatContext();

    useEffect(() => {
        setToggleChat(false);
    }, [ setToggleChat ]);

    return(<></>)
}

class Match extends Component<IProps, IState> {
    private axiosCancelSource: CancelTokenSource = axios.CancelToken.source();

    state: IState = {
        matchLoaded: false,
        matchData: { textCustom: '' } as SocketMatchData,
        gameData: {
            countdown: 99,
            timer: 0,
            latency: 0,
            isSpectator: 0,
            isDisabled: true,
            isBanned: false,
            isAnticheat: false,
            isTimeRanOut: false,
            isTooManyMistakes: false,
            isConnectionTimedOut: false,
            isReconnecting: false,
            isReconnected: false,
            isNotReconnected: false,
        },
        participantsData: [],
        endMatchData: {} as SocketMatchEndData,
        roundsTotal: 0,
        achievementString: '',
        queueRoundEnd: false,
        queueRoundWon: false,
        showRound: 0,
        redirect: '',
    };

    keyMap = {
        GOTO_REDO: ConfigService.getShortcutGameRedo().toLowerCase()
    };

    handlers = {
        GOTO_REDO: () => (this.state.endMatchData && this.state.endMatchData.roundData) ? this.setState({ redirect: `/play/${this.props.textType || 'random'}` }) : false
    };

    private io!: Socket;
    private playerData!: AuthenticationSessionData;
    private matchData!: SocketMatchData;
    private gameTimer: NodeJS.Timeout | undefined;

    async componentDidMount() {

        DebugService.clear();
        DebugService.add('[Match] Mounted game to client');
        this.handleKeydown = this.handleKeydown.bind(this);
        this.beforeUnload = this.beforeUnload.bind(this);
        document.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('beforeunload', this.beforeUnload);
        await this.initializeMatch();
    }

    async componentWillUnmount() {
        DebugService.clear();
        if (this.gameTimer) clearInterval(this.gameTimer);
        if (this.io) this.io.disconnect();
        this.axiosCancelSource.cancel();
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('beforeunload', this.beforeUnload);
    }

    playSound = () => {
        DebugService.add('[Match] Played Level Completed audio queue');
        if (document.getElementById('LevelCompleted') && ConfigService.getMatchFinishBeep() === '1') {
            // @ts-ignore
            document.getElementById('LevelCompleted').play();
        }
    };

    handleKeydown(e: KeyboardEvent) {
        const { endMatchData, gameData } = this.state;
        if ( (e.key === 's' && e.ctrlKey) )
            e.preventDefault();
        if (!endMatchData || ((endMatchData && !endMatchData.roundData) && gameData.countdown >= 1)) {
            if (e.key === 'Backspace') {
                e.preventDefault();
            }
        }
    }

    beforeUnload(e: BeforeUnloadEvent) {
        const { endMatchData } = this.state;
        if (!endMatchData || (endMatchData && !endMatchData.roundData)) {
            e.preventDefault();
            e.returnValue = true;
        }
    }

    public async getSession(): Promise<AuthenticationSessionData> {
        DebugService.add('[Match] Grabbed Player session data');
        const response = await axios.get(`${Config.authUrl}/session`, {
            cancelToken: this.axiosCancelSource.token,
            withCredentials: true
        });
        const json = await response.data.data;

        if (json.redirect) {
            window.removeEventListener('beforeunload', this.beforeUnload);
            return window.location.href = json.redirect;
        } else
            return json;
    }

    private sendKeystroke = (keystroke: string, event: boolean): void => {
        const keyPayload = {
            playerId: this.playerData.playerId,
            keystroke,
            event
        };
        this.io.emit('sendKeystroke', keyPayload);
    };

    private sendWord = (word: string): void => {
        DebugService.add('[Match] Word has been sent');
        const wordPayload = {
            playerId: this.playerData.playerId,
            word,
        };
        this.io.emit('sendWord', wordPayload);
    };

    async initializeMatch(): Promise<void> {
        DebugService.add('[Match] Server has been called to be initialized');
        if (this.gameTimer) clearInterval(this.gameTimer);
        this.playerData = await this.getSession();
        if (!this.playerData.playerId) {
            toast.info('User not found, redirecting...');
            this.setState({ redirect: '/' });
        }
        if (this.io) this.io.disconnect();
        else this.socketMatch();
    }

    socketMatch(): void {
        DebugService.add('[Match] Server has been initialized');
        const { matchData } = this;
        const { matchLoaded } = this.state;

        this.setState({ matchData, participantsData: [] });

        let wsString = '';
        if (Config.gameServer.Port !== null) wsString = `:${Config.gameServer.Port}`;

        this.io = new Socket(`${Config.gameServer.URL}${wsString}/game`, {
            transports: ['websocket', 'polling']
        });

        this.io.onError(() => {
            DebugService.add('[Match] onError called');
            this.io.emit('disconnect', {});
        });

        this.io.onDisconnect((data) => DebugService.add(`[Match] onDisconnect called ${data}`))
        this.io.onReconnect(() => DebugService.add('[Match] onReconnect called'));
        this.io.onReconnecting(() => DebugService.add('[Match] onReconnecting called'));

        this.io.onConnectLost(() => {
            const { gameData } = this.state;
            DebugService.add('[Match] onConnectLost called');
            gameData.isConnectionTimedOut = true;
            gameData.isDisabled = false;
            this.setState({ gameData });
        });

        this.io.onConnectNotSaved(() => {
            const { gameData } = this.state;
            DebugService.add('[Match] onConnectNotSaved called');
            gameData.isNotReconnected = true;
            gameData.isDisabled = true;
            this.setState({ gameData });
        });

        this.io.onConnectSaving(() => {
            const { gameData } = this.state;
            DebugService.add('[Match] onConnectSaving called');
            gameData.isReconnecting = true;
            gameData.isDisabled = false;
            this.setState({ gameData });
        });

        this.io.onConnectSaved(() => {
            const { gameData } = this.state;
            DebugService.add('[Match] onConnectSaved called');
            gameData.isReconnecting = false;
            gameData.isNotReconnected = false;
            gameData.isConnectionTimedOut = false;
            gameData.isDisabled = false;
            this.setState({ gameData });
        });

        this.io.onConnect(() => DebugService.add('[Match] Client made handshake with server'));
        if (!matchLoaded) {
            DebugService.add('[Match] Match not joined, joining now...');
            const joinPayload = {
                playerToken: CookieService.get('playerToken'),
            };
            this.io.emit('joinMatch', joinPayload);
        }

        this.io.on('getMatch', (data: SocketMatchData) => {
            DebugService.add('[Match] Match data has been received');
            this.setState({ matchData: data, matchLoaded: true });
        });

        this.io.on('matchNotFound', () => {
            DebugService.add('[Match] No Game has been found, redirecting');
            toast.info('Match not found, redirecting...');
            this.setState({ redirect: '/' });
        });

        this.io.on('sendLatencyPing', () => {
            DebugService.add('[Match] Ping to client sent');
            this.io.emit('sendLatencyPong', {});
        });

        this.io.on('achievementUnlocked', (data: { message: string; }) => {
            if (data.message)
                toast.success(data.message);
        });

        this.io.on('levelUp', (data: { level: number }) => {
           if (data.level)
               toast.success(`You have ranked up to Level ${data.level}!`);
        });

        this.io.on('getLatency', (data: { latency: number }) => {
            const { gameData } = this.state;
            gameData.latency = data.latency;

            this.setState({ gameData });
        });

        this.io.on('endMatch', (data: SocketMatchEndData) => {
            DebugService.add('[Match] Match has been successfully ended.');
            this.playSound();

            if (this.gameTimer) clearInterval(this.gameTimer);

            if (!data.roundData) {
                const { gameData } = this.state;
                gameData.isTimeRanOut = true;
                this.setState({ gameData });
            } else {
                const { gameData } = this.state;
                gameData.isDisabled = true;
                gameData.countdown = -1;

                this.setState({
                    endMatchData: data,
                    gameData,
                });
            }
        });

        this.io.on('banDetected', () => {
            const { gameData } = this.state;
            gameData.isBanned = true;
            this.setState({ gameData });
        });

        this.io.on('cheatDetected', () => {
            const { gameData } = this.state;
            gameData.isAnticheat = true;
            this.setState({ gameData });
        });

        this.io.on('manyMistakes', () => {
            const { gameData } = this.state;
            gameData.isTooManyMistakes = true;
            this.setState({ gameData });
        });

        this.io.on('timeoutMatch', () => {
            const { gameData } = this.state;
            gameData.isTimeRanOut = true;
            this.setState({ gameData });
        });

        this.io.on('sendTimer', (data: { timer: number }) => {
            DebugService.add('[Match] Game timer has been sent');
            const { gameData } = this.state;

            // Vars
            gameData.timer = data.timer;

            // Game Timer
            if (gameData.timer) {
                let newTimer = gameData.timer;
                this.gameTimer = setInterval(() => {
                    if (newTimer <= 0 && this.gameTimer)
                        clearInterval(this.gameTimer);

                    gameData.timer = newTimer;
                    this.setState({ gameData });
                    newTimer--;
                }, 1000);
            }
        });

        this.io.on('sendCountdown', (data: { countdown: number }) => {
            DebugService.add('[Match] Countdown timer has been sent');
            const { gameData } = this.state;
            const roundedTimer = Math.round(data.countdown);

            if (roundedTimer < 1) {
                this.setState({ queueRoundEnd: false, queueRoundWon: false });
                gameData.isDisabled = false;
            }
            gameData.countdown = Math.round(roundedTimer);
            this.setState({ gameData });
        });

        this.io.on('updateRound', (data: { userRoundWon: string; textContent: string; roundsTotal: number }) => {
            const { matchData, gameData } = this.state;

            DebugService.add('[Match] Ranked round has been updated');
            DebugService.add(`[Match] Ranked old text: ${matchData.textContent}`);
            DebugService.add(`[Match] Ranked new text: ${data.textContent}`);

            matchData.textContent = data.textContent;
            matchData.textCustom = data.textContent;
            gameData.isDisabled = true;

            const didYouWin = (this.playerData.playerId === data.userRoundWon)

            this.setState({ gameData, matchData, queueRoundEnd: true, queueRoundWon: didYouWin, roundsTotal: data.roundsTotal });
            this.io.emit('roundReset', {});
        });

        this.io.on('sendLatency', (data: { latency: number }) => {
            const { gameData } = this.state;
            gameData.latency = data.latency;
            this.setState({ gameData });
        });

        this.io.on('updatePlayers', (data: SocketMatchPlayerData[]) => {
            DebugService.add('[Match] Players have been pulled to client');

            const { playerData } = this;
            const { gameData } = this.state;
            const dataLength = data.length;
            for (let i = 0; i < dataLength; i++) {
                /* @ts-ignore */ 
                if (data[i].playerId === playerData.playerId && data[i].teamId === 0) {
                    gameData.isSpectator = 1;
                    this.setState({ gameData });
                }
            }
            this.setState({ participantsData: data });
        });

        this.io.on('updateWPM', (data: SocketMatchPlayerData) => {
            let i;
            const { participantsData, gameData, matchData } = this.state;
            const pLength = participantsData ? participantsData.length : 0;
            const quoteString = matchData.textContent;
            for (i = 0; i < pLength; i++) {
                /* @ts-ignore */ 
                if (participantsData && participantsData[i] && participantsData[i].playerId === data.playerId) {
                    if (data.forceReset) {
                        /* @ts-ignore */ 
                        participantsData[i].WPM = 0;
                        /* @ts-ignore */ 
                        participantsData[i].Progress = 0;
                        /* @ts-ignore */ 
                        participantsData[i].correctKeystrokes = 0;
                        /* @ts-ignore */ 
                        participantsData[i].Accuracy = 100;
                        /* @ts-ignore */ 
                        participantsData[i].correctKeystrokeString = "";
                        /* @ts-ignore */ 
                        participantsData[i].currentKeystroke = data.currentKeystroke;
                        /* @ts-ignore */ 
                        participantsData[i].currentWord = data.currentWord;
                    } else {
                        /* @ts-ignore */ 
                        if (data.currentWord) participantsData[i].currentWord = data.currentWord;
                        /* @ts-ignore */ 
                        if (data.WPM) participantsData[i].WPM = data.WPM;
                        /* @ts-ignore */ 
                        if (data.Progress) participantsData[i].Progress = data.Progress;
                        /* @ts-ignore */ 
                        if (data.Quit) participantsData[i].Quit = data.Quit;
                        /* @ts-ignore */ 
                        if (data.roundsWon) participantsData[i].roundsWon = data.roundsWon;
                        /* @ts-ignore */ 
                        if (data.Placement) participantsData[i].Placement = data.Placement;
                        /* @ts-ignore */ 
                        if (data.PlacementFinal) participantsData[i].PlacementFinal = data.PlacementFinal;
                        /* @ts-ignore */ 
                        if (data.correctKeystrokes) participantsData[i].correctKeystrokes = data.correctKeystrokes;
                        /* @ts-ignore */ 
                        if (data.currentKeystroke) participantsData[i].currentKeystroke = data.currentKeystroke;
                        /* @ts-ignore */ 
                        if (data.Accuracy) participantsData[i].Accuracy = data.Accuracy;
                        /* @ts-ignore */ 
                        if (gameData.isSpectator && participantsData[i].correctKeystrokes) {
                            /* @ts-ignore */ 
                            participantsData[i].correctKeystrokeString = '';
                            let j;
                            for (j = 35; j >= 2; j--) {
                                // @ts-ignore
                                if (participantsData[i]) {
                                    // @ts-ignore
                                    const keystroke = participantsData[i].correctKeystrokes - j;
                                    if (quoteString.charAt(keystroke) && quoteString.charAt(keystroke) !== 'undefined') {
                                        /* @ts-ignore */ 
                                        participantsData[i].correctKeystrokeString += quoteString.charAt(keystroke);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.setState({ participantsData });
        });
        this.io.on('forceEndMatch', () => this.io.emit('sendWord', { forceEnd: 1 }));
    }

    render() {
        const { playerData } = this;
        const { textType, embed, embedClose, embedOwner } = this.props;
        const { matchData, participantsData, gameData, endMatchData, queueRoundEnd, queueRoundWon, roundsTotal, redirect } = this.state;
        const endMatch = (endMatchData && endMatchData.roundData && endMatchData.roundData.length !== 0);
        let 
            totalParticipants = 0,
            noticeString = '',
            firstWord = '',
            leaveUrl = '',
            restartUrl = '',
            quoteString = ''

        // Socket-IO
        if (gameData.isBanned)
            noticeString = "Your account is currently banned, please contact support.";
        else if (gameData.isAnticheat)
            noticeString = "You have run out of time to complete the Game. Better luck next time!"
        else if (gameData.isNotReconnected)
            noticeString = "We have failed to reconnect you back to the Game.";
        else if (gameData.isTooManyMistakes)
            noticeString = "You have made too many mistakes!";
        else if (gameData.isTimeRanOut)
            noticeString = "You have ran out of time!";


        if (matchData) {
            // Redirects
            if (matchData.flagId === 2 && matchData.referralId && gameData.isTimeRanOut) return <Redirect to={`/custom/${matchData.referralId}`} />;
            if (matchData.flagId === 1 && matchData.tournamentId && gameData.isTimeRanOut) return <Redirect to={`/competitions/${matchData.tournamentId}`} />;

            quoteString = matchData.textCustom && matchData.textCustom !== '' ? matchData.textCustom : matchData.textContent;
            if (quoteString && participantsData) firstWord = quoteString.split(' ')[0] || '';

            leaveUrl = matchData.flagId !== 3 ? (matchData.referralId ? `/` : matchData.tournamentId !== '' ? `/competitions/${matchData.tournamentId}` : `/`) : `/`;
            restartUrl = matchData.flagId !== 3 ? matchData.referralId ? `/custom/${matchData.referralId}` : matchData.tournamentId !== '' ? `/competitions/${matchData.tournamentId}/`  : `/play${textType ? `/${textType}` : ''}`  : '/';
        }

        if (participantsData) {
            const participantsLength = participantsData.length;
            let x;
            for (x = 0; x < participantsLength; x++) {
                /* @ts-ignore */ 
                if (participantsData[x].teamId !== 0)
                    totalParticipants++;
            }
        }

        const matchContainerCSS = (ConfigService.getUpscaleMatchContainer() === '1' && gameData.isSpectator === 0) ? 'container-small' : 'container-game';
        const getPerformanceMode = ConfigService.getPerformanceMode();

        const gameContainer = (
            <>
                <CloseChat />
                <GlobalHotKeys keyMap={this.keyMap} handlers={this.handlers} />
                <audio id="LevelCompleted" src="/audio/LevelCompleted.wav" crossOrigin="anonymous" preload="auto" />
                <audio id="CountBeep" src="/audio/CountBeep.wav" crossOrigin="anonymous" preload="auto" />
                <audio id="CountStart" src="/audio/CountStart.wav" crossOrigin="anonymous" preload="auto" />
                {matchData && gameData.countdown !== -1 && <MatchCountdown url={matchData.referralId ? restartUrl : leaveUrl} isSpectator={gameData.isSpectator} isDisabled={gameData.isDisabled} countdown={gameData.countdown} win={queueRoundWon} roundEnd={queueRoundEnd} />}
                <MatchToast isReconnecting={gameData.isReconnecting} isConnectionLost={gameData.isConnectionTimedOut} />
                <div className={`${matchContainerCSS ?? 'container-small'} pt-10`}>
                    {gameData.isSpectator === 0 ? (
                        <>
                            {(getPerformanceMode === '1' && (!endMatchData || (endMatchData && !endMatchData.roundData))) && <div className={"fixed z-50 top-0 right-0 bottom-0 left-0 bg-gray-900 bg-opacity-50 w-full h-screen"} />}
                            <div className={`relative ${getPerformanceMode === '1' ? 'z-50' : 'z-20'} flex ${endMatchData && endMatchData.roundData && endMatchData.roundData.length !== 0 ? 'h-auto container-margin' : `h-auto lg:h-game container-padding`}`}>
                                <Player embed={embed || false} embedClose={embedClose} embedOwner={embedOwner} totalPlayers={totalParticipants} translation={this.props.t('page.match.statistics_unsaved')} firstWord={firstWord} sendKeystroke={this.sendKeystroke} sendWord={this.sendWord} playerData={playerData} gameData={gameData} quoteString={quoteString} endMatch={endMatch} endMatchData={endMatchData} leaveUrl={leaveUrl} matchData={matchData} participantsData={participantsData} noticeString={noticeString} restartUrl={restartUrl} roundsTotal={roundsTotal} />
                            </div>
                        </>
                    ) : (
                        <div className={`flex py-6 h-auto lg:h-nav`}>
                            <Spectator embedClose={embedClose} embedOwner={embedOwner} translation={this.props.t('page.match.statistics_unsaved')} totalPlayers={totalParticipants} firstWord={firstWord} gameData={gameData} quoteString={quoteString} leaveUrl={leaveUrl} matchData={matchData} participantsData={participantsData} noticeString={noticeString} restartUrl={restartUrl} roundsTotal={roundsTotal} />
                        </div>
                    )}
                </div>

                <div className="absolute top-1/3 left-8 hidden 4xl:block">
                    <SidebarSquare />
                </div>

                <div className="absolute top-1/4 left-8 hidden 4xl:block">
                    <SidebarLong />
                </div>
            </>
        )

        if (redirect && redirect !== '')
            return <Redirect to={redirect} />;
        else
            return !embed ? (
                <Base meta={<Meta title="In Game" />} isLoaded={(matchData !== null && playerData !== null)}>
                    {gameContainer}
                </Base>
            ) : (
                <div>
                    {gameContainer}
                </div>
            );
    }
}

export default withTranslation()(Match);
