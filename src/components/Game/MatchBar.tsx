import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleDoubleLeft, faStopwatch, faWifi} from '@fortawesome/free-solid-svg-icons';
import GameTimer from './countdown/GameTimer';
import {SocketMatchGameData} from "../../types.client.socket";
import {GamemodeData} from "../../types.client.mongo";
import Link from '../Uncategorized/Link';

interface IProps {
  redirectUrl: string;
  gameData: SocketMatchGameData;
  modeData: GamemodeData;
  className?: string;
  isCapslock?: boolean;
  isSpectate: number;
  embed?: boolean;
  embedClose?: () => void | false;
  embedOwner?: boolean;
}

const MatchBar: FC<IProps> = (props) => {
    const { redirectUrl, className, gameData, modeData, isSpectate, isCapslock, embedClose, embedOwner, embed } = props;

    return (
        <>
            {!isSpectate ? (
              <div className={`game--content--bar ${className} flex flex-wrap`}>
                  {embedOwner && embedClose ? (
                      <div className={`w-auto my-auto pl-3 ${!isCapslock ? 'mr-auto' : ''}`}>
                          <button type={"button"} onClick={embedClose} className="text-pink-400 focus:outline-none text-sm uppercase font-semibold">
                              End Match
                          </button>
                      </div>
                  ) : !embed ? (
                      <div className={`w-auto my-auto ${!isCapslock ? 'mr-auto' : ''}`}>
                          <Link to={redirectUrl} className="text-orange-400 transition hover:opacity-70 focus:outline-none text-sm uppercase font-semibold">
                              <FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-1" /> Leave
                          </Link>
                      </div>
                  ) : <div className={"w-auto mr-auto"} /> }
                {isCapslock && (
                  <div className={"w-auto px-4 pt-1 text-sm mr-auto my-auto"}>
                      <span className={"font-semibold text-white text-red-400"}>
                          CAPSLOCK is Enabled
                      </span>
                  </div>
                )}
                <div className="w-auto my-auto font-semibold text-white text-right pt-px">
                  {modeData && modeData.modeConfig && modeData.modeConfig.ROUND_LIMIT === 0 && gameData.countdown < 0 && gameData.timer > 0 && !gameData.isBanned && !gameData.isAnticheat && (
                    <span className="px-3 w-auto mr-3">
                      <FontAwesomeIcon icon={faStopwatch} className="text-red-400 mr-2" />
                      <GameTimer timer={gameData.timer} />
                    </span>
                  )}
                  <span className="pl-3 w-auto">
                    <FontAwesomeIcon icon={faWifi} className="text-blue-400 mr-1" /> {gameData.latency}ms
                  </span>
                </div>
              </div>
            ) : (
              gameData.countdown < 0 && gameData.timer > 0 && !gameData.isBanned && !gameData.isAnticheat && (
                <div>
                  <div className="bg-black bg-opacity-25 text-white w-64 text-center mx-auto mb-4 p-3 rounded text-4xl font-semibold tracking-wide rounded">
                    <FontAwesomeIcon icon={faStopwatch} className="text-red-400 mr-2" />
                    <GameTimer timer={gameData.timer} />
                  </div>
                </div>
              )
            )}
        </>
    );
}

export default MatchBar;
