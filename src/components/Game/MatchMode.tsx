import { useTranslation } from 'next-i18next';
import GameTimer from "./countdown/GameTimer";
import {SocketMatchData} from "../../types.client.socket";

interface IProps {
  matchData: SocketMatchData;
  countdown: number;
  timer: number;
  roundsTotal: number;
  totalPlayers: number;
  isSpectate?: boolean;
}

const MatchMode = (props: IProps) => {
    const { matchData, countdown, timer, isSpectate, totalPlayers, roundsTotal } = props;
    const { t } = useTranslation();

    let flagName = '';

    if (matchData) {
      const flagInt = matchData.flagId;
      switch (flagInt) {
        case 0:
          flagName = 'Public';
          break;
        case 1:
          flagName = 'Ladder';
          break;
        case 2:
          flagName = 'Custom';
          break;
        case 3:
          flagName = 'Ranked';
          break;
        default:
          flagName = 'Public';
          break;
      }
    }

    return matchData?.modeData ? (
      <>
        {matchData.modeData && matchData.modeData.modeConfig.ROUNDS.LIMIT === 0 ? (
          <div className="flex flex-wrap mb-4">
            <div className={`w-full ${isSpectate ? 'md:w-1/3' : 'md:w-1/2'} text-center md:text-left my-auto`}>
              <div className="text-xl text-white uppercase font-semibold tracking-wider">{matchData.modeData.modeName}</div>
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{flagName}</div>
            </div>
            {isSpectate && timer && (
                <div className={"w-full md:w-1/3 my-auto text-center"}>
                  {countdown <= 0 && (
                      <div className={"text-white text-xl font-semibold tracking-wider"}>
                        <div className={"text-gray-400 text-xl font-semibold tracking-wider"}>
                          <GameTimer timer={timer} />
                        </div>
                      </div>
                  )}
                </div>
            )}
            <div className={`w-full ${isSpectate ? 'md:w-1/3' : 'md:w-1/2'} text-center md:text-right my-auto`}>
              <div className="text-xl text-orange-400 uppercase font-semibold tracking-wider">
                {totalPlayers.toLocaleString()} player{totalPlayers !== 1 && 's'}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap mb-4">
            <div className={`w-full ${isSpectate ? 'md:w-1/3' : 'md:w-1/2'} text-center md:text-left my-auto`}>
              <div className="text-xl text-white uppercase font-semibold tracking-wider">{matchData.modeData.modeName}</div>
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{flagName}</div>
            </div>
            {isSpectate && timer && (
              <div className={"w-full md:w-1/3 my-auto text-center"}>
                {countdown <= 0 && (
                    <div className={"text-white text-xl font-semibold tracking-wider"}>
                      <div className={"text-gray-400 text-xl font-semibold tracking-wider"}>
                        <GameTimer timer={timer} />
                      </div>
                    </div>
                )}
              </div>
            )}
            <div className={`w-full ${isSpectate ? 'md:w-1/3' : 'md:w-1/2'} text-center md:text-right my-auto`}>
              <div className="text-xl text-orange-400 uppercase font-semibold tracking-wider">{((roundsTotal + 1) > matchData.modeData.modeConfig.ROUNDS.LIMIT) ? (t('other.gameover')) : `Round ${roundsTotal + 1}`}</div>
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                Best of {matchData.modeData.modeConfig.ROUNDS.LIMIT}
              </div>
            </div>
          </div>
        )}
      </>
    ) : <></>;
}

export default MatchMode;
