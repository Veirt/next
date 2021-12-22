import {FC, useEffect, useCallback} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import useConfig from '../../../hooks/useConfig';

export interface MatchCountdownProps {
  countdown: number;
  url: string;
  isSpectator: boolean;
  win?: boolean;
  roundEnd?: boolean;
  isDisabled?: boolean;
}

const MatchCountdown: FC<MatchCountdownProps> = (props) => {

  const { countdown, win, roundEnd, isSpectator } = props;
  const { countdownBeep } = useConfig();

  const playCountdownAudio = useCallback(() => {
    const getBeep = (document.getElementById('CountBeep') as HTMLAudioElement);
    const getStart = (document.getElementById('CountStart') as HTMLAudioElement);

    if (countdown !== 0) {
      getBeep.currentTime = 0;
      getStart.currentTime = 0;
    }

    if (countdown !== 99) {
      if (countdown >= 1 && getBeep && countdownBeep === '1')
        getBeep.play();

      if (countdown === 0 && getStart && countdownBeep === '1')
        getStart.play();
    }
  }, [ countdown ]);

  useEffect(() => {
    const countdownTimer = (document.getElementById('countdownTimer') as HTMLElement);
    if (props.roundEnd && countdownTimer)
      countdownTimer.style.opacity = '1';
  }, [ props.roundEnd ])

  useEffect(() => {
    playCountdownAudio();
  }, [ playCountdownAudio ]);

  let countdownClass = 'text-red-400';
  const renderCountdown = countdown;

  // switch(true) did not work in this case for some odd reason;
  if (renderCountdown <= 2) {
    countdownClass = 'text-yellow-400';
  }
  if (renderCountdown <= 0) {
    countdownClass = 'text-green-400';

    const countdownTimer = (document.getElementById('countdownTimer') as HTMLElement);
    if (countdownTimer)
      countdownTimer.style.opacity = '0';
  }

  return (
      <>
        {renderCountdown >= 0 && (
          <div id="countdownTimer" style={{ opacity: (roundEnd ? '0' : '1'), zIndex: 55 }} className="fixed left-0 right-0 top-0 transition ease-in-out duration-500">
            <div className="w-full flex h-screen bg-black bg-opacity-70">

              <div className="m-auto">
                <div className={"max-w-screen-sm mx-auto"}>
                  {!isSpectator && roundEnd && (
                      <div className={"text-center text-2xl pb-8 uppercase text-white font-bold tracking-wider"}>
                        You have <span className={"text-orange-400"}>{win ? 'won' : 'lost'}</span> the round!
                      </div>
                  )}
                  {isSpectator && roundEnd && (
                      <div className={"text-center text-2xl pb-8 uppercase text-white font-bold tracking-wider"}>
                        Round Completed!
                      </div>
                  )}
                  <div className="w-32 mx-auto rounded bg-gray-775 bg-opacity-75 shadow text-center py-3">
                    <div style={{ fontSize: '4em' }} className={`font-bold pb-1 ${countdownClass}`}>
                      {countdown >= 15 ? (
                        <FontAwesomeIcon icon={faCircleNotch} className="text-blue-400" spin />
                      ) : (
                          <span>{renderCountdown > 0 ? renderCountdown : <span>GO</span>}</span>
                      )}
                    </div>
                  </div>
                  {!isSpectator && roundEnd && (
                      <div className={"text-lg pt-8 uppercase text-white font-semibold tracking-wider"}>
                        The next round will be starting soon...
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
  );
}

export default MatchCountdown;
