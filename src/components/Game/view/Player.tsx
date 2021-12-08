import {FC, useEffect, useState} from "react";
import MatchNotice from "../MatchNotice";
import MatchEnd from "../MatchEnd";
import MatchMode from "../MatchMode";
import MatchBar from "../MatchBar";
import MatchContent from "../MatchContent";
import {
    SocketMatchData,
    SocketMatchEndData,
    SocketMatchGameData,
    SocketMatchPlayerData
} from "../../../types.client.socket";
import {AuthenticationSessionData} from "../../../types.client.mongo";
import Playercard from "../participants/Playercard";
import Playerboard from "../participants/Playerboard";
import useConfig from "../../../hooks/useConfig";
import MatchLeaderboards from "../leaderboards/MatchLeaderboards";

interface IProps {
    matchData: SocketMatchData | null;
    participantsData: SocketMatchPlayerData[];
    endMatchData: SocketMatchEndData | null;
    gameData: SocketMatchGameData | null;
    playerData: AuthenticationSessionData | null;
    restartUrl: string;
    totalPlayers: number;
    leaveUrl: string;
    firstWord: string;
    endMatch: boolean;
    noticeString: string;
    roundsTotal: number;
    quoteString: string;
    translation: string;
    sendKeystroke: (keystroke: string, event: boolean) => void;
    sendWord: (word: string) => void;
    embed: boolean;
    embedClose?: () => void | false;
    embedOwner?: boolean;
}

const Player: FC<IProps> = (props) => {

    const [ isCapslock, setIsCapslock ] = useState(false);
    const { embed, embedClose, embedOwner, gameData, totalPlayers, sendKeystroke, firstWord, sendWord, endMatch, endMatchData, playerData, quoteString, noticeString, roundsTotal, matchData, participantsData, restartUrl, leaveUrl } = props;
    const handleCapslock = (e: KeyboardEvent) => setIsCapslock(e.getModifierState("CapsLock"));
    
    const { gameplayParticipantStyle, performanceMode, matchContainerTransparent } = useConfig();

    useEffect(() => {
        window.addEventListener('keyup', handleCapslock);
        return () => window.removeEventListener('keyup', handleCapslock);
    }, [props]);
    return (
        <>
            {matchData && playerData && gameData && (
                <div className={"my-auto w-full"}>
                    {matchData && endMatch ? (
                        <MatchEnd
                            playersLength={participantsData.length}
                            data={endMatchData}
                            isRanked={matchData.flagId === 3}
                            isRounds={matchData.modeData.modeConfig.ROUND_LIMIT !== 0}
                            showRewards={matchData.flagId === 0 || matchData.flagId === 3}
                            isMode={matchData.modeId}
                            leaveUrl={matchData.referralId ? restartUrl : leaveUrl}
                            restartUrl={restartUrl}
                            tournamentId={matchData.tournamentId}
                            lobbyReferral={matchData.referralId || ''}
                            embed={embed}
                            embedClose={embedClose}
                            embedOwner={embedOwner}
                        />
                    ) : (
                        <div className={`relative`}>
                            <MatchMode
                                totalPlayers={totalPlayers}
                                matchData={matchData}
                                roundsTotal={roundsTotal}
                            />
                            <MatchBar className="rounded-t" embed={embed} embedClose={embedClose} embedOwner={embedOwner} isCapslock={isCapslock} redirectUrl={(matchData && matchData.referralId) ? restartUrl : leaveUrl} modeData={matchData && matchData.modeData} gameData={gameData} isSpectate={0} />
                            {noticeString
                                ? <MatchNotice message={noticeString} />
                                : (
                                    <div className={`${matchContainerTransparent === '1' ? 'match--container-transparent' : 'match--container'}`}>
                                        <MatchContent
                                            quote={quoteString && quoteString !== "KEYMASH_GAMEMODE_ROUND_END" ? quoteString : ""}
                                            sendKeystroke={sendKeystroke}
                                            sendWord={sendWord}
                                            isSuddenDeath={matchData.modeData.modeConfig.FINISH_TRIGGER.FIRST_TYPO || matchData.modeData.modeConfig.ROUND_TRIGGER.FIRST_TYPO}
                                            disabled={gameData.isDisabled}
                                        />
                                    </div>
                                )
                            }

                        </div>
                    )}
                    {(performanceMode === '0' || endMatch) && (
                        <>
                            {(!participantsData || participantsData.length === 0) && <div className={"py-10"} />}
                            {gameplayParticipantStyle === '0' && <Playercard participantsData={participantsData} isFinished={(endMatchData && endMatchData.roundData && endMatchData.roundData.length !== 0) ? true : false} firstWord={firstWord} modeId={matchData.modeId} roundLimit={matchData.modeData.modeConfig.ROUND_FIRST} />}
                            {gameplayParticipantStyle === '1' && <Playerboard isSpectator={0} quoteString={quoteString} participantsData={participantsData} firstWord={firstWord} modeId={matchData.modeId} roundLimit={matchData.modeData.modeConfig.ROUND_FIRST} />}
                            {(!embed && endMatch && !noticeString && matchData.flagId === 0) && (
                                <div className="w-full">
                                    <div className="my-8 md:my-16 lg:my-32">
                                        <MatchLeaderboards textId={matchData.textId} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default Player;
