import React, { FC, useEffect, useState } from 'react';
import MatchNotice from '../MatchNotice';
import MatchEnd from '../MatchEnd';
import MatchMode from '../MatchMode';
import MatchBar from '../MatchBar';
import { SocketMatchData, SocketGameEndData, SocketMatchPlayerData } from '../../../types.client.socket';
import { AuthenticationSessionData } from '../../../types.client.mongo';
import Playercard from '../participants/Playercard';
import Playerboard from '../participants/Playerboard';
import useConfig from '../../../hooks/useConfig';
import MatchLeaderboards from '../leaderboards/MatchLeaderboards';
import MatchTextContainer from '../MatchTextContainer';
import PlayerRacetrack from '../participants/PlayerRacetrack';

interface IProps {
  matchData: SocketMatchData | null;
  participantsData: SocketMatchPlayerData[];
  endMatchData: SocketGameEndData | null;
  playerData: AuthenticationSessionData | null;
  countdown: number;
  disabled: boolean;
  latency: number;
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
  embed: boolean;
  embedClose?: () => void | false;
  embedOwner?: boolean;
}

const Player: FC<IProps> = (props) => {
  const [isCapslock, setIsCapslock] = useState(false);
  const { embed, embedClose, embedOwner, countdown, disabled, latency, totalPlayers, sendKeystroke, firstWord, endMatch, endMatchData, playerData, quoteString, noticeString, roundsTotal, matchData, participantsData, restartUrl, leaveUrl } = props;
  const handleCapslock = (e: KeyboardEvent) => setIsCapslock(e.getModifierState('CapsLock'));

  const { gameplayParticipantStyle, focusMode } = useConfig();

  useEffect(() => {
    window.addEventListener('keyup', handleCapslock);
    return () => window.removeEventListener('keyup', handleCapslock);
  }, []);
  return (
    <>
      {matchData && playerData && (
        <div className={'my-auto w-full'}>
          {matchData && endMatch && endMatchData !== null ? (
            <MatchEnd playersLength={participantsData.length} data={endMatchData} matchData={matchData} leaveUrl={matchData.referralId ? restartUrl : leaveUrl} restartUrl={restartUrl} embed={embed} embedClose={embedClose} embedOwner={embedOwner} />
          ) : (
            <div className={`relative`}>
              <MatchMode totalPlayers={totalPlayers} matchData={matchData} roundsTotal={roundsTotal} countdown={countdown} />
              <MatchBar
                className="rounded-t"
                embed={embed}
                embedClose={embedClose}
                embedOwner={embedOwner}
                isCapslock={isCapslock}
                redirectUrl={matchData && matchData.referralId ? restartUrl : leaveUrl}
                modeData={matchData && matchData.modeData}
                countdown={countdown}
                disabled={disabled}
                latency={latency}
                isSpectate={0}
              />
              {noticeString ? <MatchNotice message={noticeString} /> : <MatchTextContainer quote={quoteString && quoteString !== 'KEYMASH_GAMEMODE_ROUND_END' ? quoteString : ''} sendKeystroke={sendKeystroke} isSuddenDeath={matchData.modeData.modeConfig.TRIGGERS.FIRST_TYPO} disabled={disabled} />}
            </div>
          )}
          {(focusMode === '0' || endMatch) && (
            <>
              {(!participantsData || participantsData.length === 0) && <div className={'py-10'} />}
              {gameplayParticipantStyle === '2' && (
                <Playercard participantsData={participantsData} isFinished={endMatchData && endMatchData.roundData && endMatchData.roundData.length !== 0 ? true : false} firstWord={firstWord} modeId={matchData.modeId} roundLimit={matchData.modeData.modeConfig.ROUNDS.FIRST} />
              )}
              {gameplayParticipantStyle === '0' && (
                <PlayerRacetrack
                  quoteString={quoteString}
                  participantsData={participantsData}
                  isFinished={endMatchData && endMatchData.roundData && endMatchData.roundData.length !== 0 ? true : false}
                  firstWord={firstWord}
                  modeId={matchData.modeId}
                  roundLimit={matchData.modeData.modeConfig.ROUNDS.FIRST}
                />
              )}
              {gameplayParticipantStyle === '1' && <Playerboard isSpectator={0} quoteString={quoteString} participantsData={participantsData} firstWord={firstWord} modeId={matchData.modeId} roundLimit={matchData.modeData.modeConfig.ROUNDS.FIRST} />}
              {!embed && endMatch && !noticeString && matchData.flagId === 0 && (
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
  );
};

export default Player;
