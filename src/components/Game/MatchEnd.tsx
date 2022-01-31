import {useEffect, useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faAward, 
  faCrown,
  faBolt,
  faCircle,
  faHourglass,
  faAngleDoubleLeft,
  faAngleDoubleRight, faSpinner, faCoins,
} from '@fortawesome/free-solid-svg-icons';
import ReactCountUp from 'react-countup';
import {SocketGameEndData} from "../../types.client.socket";
import useConfig from "../../hooks/useConfig";
import ReactTooltip from "react-tooltip";
import VideoFullscreen from '../Advertisement/Units/VideoFullscreen';
import { useTranslation } from 'next-i18next';
import Chart from './MatchEnd/Chart';


interface IProps {
  data: SocketGameEndData;
  showRewards: boolean;
  playersLength: number;
  leaveUrl: string;
  restartUrl: string;
  embed: boolean;
  embedClose?: () => void | false;
  embedOwner?: boolean;

  // This should be checked
  lobbyReferral: string;
  tournamentId?: string;
  isRanked: boolean;
  isRounds: boolean;
  isMode: number;
}

const MatchEnd = (props: IProps) => {
  const { t } = useTranslation();
  
  const [ showRound, setShowRound ] = useState(0);

  const [ tab, setTab ] = useState('match');
  const [ subtab, setSubtab ] = useState('overview')
  const [ toggleAd, setToggleAd ] = useState(true);

  const { useCPM, adsGameplay } = useConfig();

  const { showRewards, isRounds, isRanked, isMode, tournamentId, data, leaveUrl, restartUrl, embed, embedOwner, embedClose } = props;

  const useRoundData = data?.roundData[showRound] || null;

  const rows = [
      {
          Name: useCPM === '0' ? 'statistics.wpm' : 'statistics.cpm',
          Value: useCPM === '0' ? useRoundData?.WPM : parseFloat(((useRoundData?.WPM || 0) * 5).toFixed(2)),
          Icon: { name: faBolt, css: 'blue-500' },
      },
      {
          Name: 'statistics.accuracy',
          Value: useRoundData?.Accuracy,
          Extension: '%',
          Icon: { name: faBullseye, css: 'orange-500' },
      },
      {
          Name: 'statistics.time',
          Value: useRoundData?.ElapsedTime,
          Extension: 's',
          Icon: { name: faHourglass, css: 'teal-500' },
      },
      {
          Name: 'statistics.mistakes',
          Value: useRoundData?.Mistakes,
          Icon: { name: faCircle, css: 'yellow-500' },
      },
  ];

  const tabs = [
      { name: 'Overview', tab: 'overview' },
      { name: 'Match', tab: 'match' },
      { name: 'Rewards', tab: 'rewards' }
  ];

  const subtabs = [
      { name: 'Statistics', tab: 'overview' },
      { name: 'Performance', tab: 'graph' }
  ]

  return useRoundData ? (
      <div className="relative">
        <ReactTooltip />
        {(adsGameplay && toggleAd) && <VideoFullscreen toggle={() => setToggleAd(false)} />}
        <audio id="LevelUp" src="/audio/LevelUp.wav" crossOrigin="anonymous" preload="auto" />
        <audio id="LevelDown" src="/audio/LevelDown.wav" crossOrigin="anonymous" preload="auto" />
        <div className="text-xl sm:text-2xl md:text-3xl uppercase text-white font-bold tracking-wide text-center pb-4">
          {t('page.match.completed')}
        </div>
        <div className="relative">
          <div id="matchEnd">
            <div className={"bg-gray-775 rounded-t-2xl flex flex-wrap justify-center text-white"}>
              {tabs.map((item) => (item.tab !== 'rewards' || (item.tab === 'rewards' && showRewards)) && (
                  <button type={"button"} onClick={() => setTab(item.tab)} className={`w-32 focus:outline-none py-2 text-sm font-semibold text-center border-b-2 ${tab === item.tab ? 'border-orange-400' : 'border-transparent'} hover:border-orange-400 transition ease-in-out duration-300`}>
                    {item.name}
                  </button>
              ))}
            </div>

            <div className={"bg-black bg-opacity-20 h-auto md:min-h-128 rounded-b-2xl shadow-lg p-4 sm:p-6 md:p-8"}>
              {tab === 'match' && (
                  <>
                    <div className={"pb-8 flex flex-wrap justify-center sm:justify-between"}>
                      <div className={"w-auto pb-4 sm:pb-0"}>
                        <div className={"flex text-white"}>
                          {subtabs.map((item, index) => (
                              <button key={item.tab} type="button" onClick={() => setSubtab(item.tab)} className={`${index === 0 ? 'rounded-l-lg' : 'rounded-r-lg'} transition ease-in-out duration-300 border-l border-gray-800 focus:outline-none py-2 px-3 text-sm ${subtab !== item.tab ? 'bg-gray-750' : 'bg-gray-775'} hover:bg-gray-775 animation-short`}>
                                {item.name}
                              </button>
                          ))}
                        </div>
                      </div>
                      <div className={"w-auto"}>
                        <div className={"flex text-white"}>
                          {isMode === 1 && (
                              [...Array(data?.roundData.length || 0)].map((_i, k) => (
                                  <button key={k} type="button" onClick={() => setShowRound(k)} className={`transition ease-in-out duration-300 border-l border-gray-800 focus:outline-none py-2 px-3 text-sm ${showRound !== k ? 'bg-gray-750' : 'bg-gray-775'} hover:bg-gray-775 animation-short`}>
                                    Round {k + 1}
                                  </button>
                              ))
                          )}
                        </div>
                      </div>
                    </div>
                    {useRoundData && (
                      <div className={"text-white"}>
                        {subtab === 'overview' && (
                            <div className={"grid grid-cols-1 sm:grid-cols-3 gap-8"}>
                                <div className={"col-span-full md:col-span-1"}>
                                    <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4"}>
                                      {rows.map(stat => (
                                          <div key={stat.Name} className={"relative bg-gray-825 shadow-md rounded-2xl px-5 py-3"}>
                                            <div className={"uppercase text-xs font-semibold text-white"}>{t(stat.Name)}</div>
                                            <div className={"text-4xl text-orange-400 font-bold"}>
                                              <ReactCountUp start={0} end={stat.Value || 0} decimal={'.'} decimals={['statistics.time', 'statistics.wpm', 'statistics.cpm'].includes(stat.Name) ? 2 : 0} />
                                              <span className={"text-2xl"}>{stat.Extension}</span>
                                            </div>
                                            {(['statistics.wpm', 'statistics.cpm'].includes(stat.Name) && data.personalBest) ? (
                                                <div className={"absolute top-0 right-0 mt-8 mr-4"} data-tip="New Personal Best for this Text!">
                                                  <FontAwesomeIcon icon={faCrown} className={"text-yellow-400"} />
                                                </div>
                                            ): ''}
                                          </div>
                                      ))}
                                    </div>
                                </div>
                                <div className={"col-span-full md:col-span-2"}>
                                    <div className={"mb-4 p-5 bg-gray-825 rounded-2xl shadow-md"}>
                                      {useRoundData.Text.source !== 'CUSTOM_TEXT' ? (
                                          <div className={"flex flex-wrap"}>
                                            <div className={"w-full md:w-1/2 lg:w-1/3"}>
                                              <div>
                                                <div className={"text-white text-xs sm:text-xs uppercase font-semibold"}>Title</div>
                                                <div className={"text-orange-400 sm:text-base lg:text-lg uppercase font-semibold"}>{useRoundData.Text.source}</div>
                                              </div>
                                              <div className={"mt-4"}>
                                                <div className={"text-white text-xs uppercase font-semibold"}>Author</div>
                                                <div className={"text-orange-400 sm:text-base lg:text-lg uppercase font-semibold"}>{useRoundData.Text.author}</div>
                                              </div>
                                              {useRoundData.Text.contributor && useRoundData.Text.contributor !== 'admin' && (
                                                  <div className={"mt-4"}>
                                                    <div className={"text-white text-xs uppercase font-semibold"}>Contributor</div>
                                                    <div className={"text-orange-400 sm:text-base lg:text-lg uppercase font-semibold truncate"}>{useRoundData.Text.contributor}</div>
                                                  </div>
                                              )}
                                            </div>
                                            <div className={"w-full md:w-1/2 lg:w-2/3 my-auto md:pl-4"}>
                                              <div className={"border-l-2 border-orange-400 pl-4 py-2 mt-4 sm:mt-0 text-xs lg:text-sm"}>
                                                {useRoundData.Text.content}
                                              </div>
                                            </div>
                                          </div>
                                      ) : <div>Dictionary - Random Words</div>}
                                    </div>

                                    <div className={"text-lg uppercase font-semibold"}>{t('page.match.mistakes')}</div>
                                    <div className={"flex flex-wrap gap-x-6 gap-y-2 pt-2"}>
                                      {useRoundData.Incorrect.map((item, index) => <div key={`${index}-${item.word}`} className={"px-3 py-1 rounded bg-red-500 bg-opacity-20 text-sm text-white"}>{item.word}</div>)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {subtab === 'graph' && <Chart {...useRoundData.Chart} />}
                      </div>
                    )}
                  </>
              )}
              {tab === 'rewards' && (
                  <div className={"flex h-full mt-20 w-full"}>
                      <div className={"mx-auto w-4/5 text-center"}>
                        <div className={"text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase font-bold text-white mb-6"}>You have been rewarded</div>
                        <div className={"mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"}>
                          <div className={"p-4 lg:p-8 text-center bg-gray-825 rounded-2xl shadow-md flex flex-nowrap justify-center sm:justify-start sm:flex-wrap"}>
                            <div className={"w-16 text-left sm:text-center sm:w-full my-auto sm:mt-auto sm:mb-0"}>
                              <FontAwesomeIcon icon={faCoins} className={"text-yellow-400 text-2xl sm:text-5xl md:text-5xl"} />
                            </div>

                            <div className={"w-32 sm:w-full text-left sm:text-center my-auto sm:pt-2"}>
                              <div className={"text-2xl font-semibold text-white uppercase"}>
                                {data?.rewards.currency.toLocaleString()}
                              </div>
                              <div className={"text-gray-400 text-sm md:text-base"}>{t('statistics.coins')}</div>
                            </div>
                          </div>

                          <div className={"p-4 lg:p-8 text-center bg-gray-825 rounded-2xl shadow-md flex flex-nowrap justify-center sm:justify-start sm:flex-wrap"}>
                            <div className={"w-16 text-left sm:text-center sm:w-full my-auto sm:mt-auto sm:mb-0"}>
                              <FontAwesomeIcon icon={faCircle} className={"text-yellow-400 text-2xl sm:text-5xl md:text-5xl"} />
                            </div>

                            <div className={"w-32 sm:w-full text-left sm:text-center my-auto sm:pt-2"}>
                              <div className={"text-2xl font-semibold text-white uppercase"}>
                                {data.rewards.exp.toLocaleString()}
                              </div>
                              <div className={"text-gray-400 text-sm md:text-base"}>{t('statistics.exp_abbreviation')}</div>
                            </div>
                          </div>

                          <div className={"p-4 lg:p-8 text-center bg-gray-825 rounded-2xl shadow-md flex flex-nowrap justify-center sm:justify-start sm:flex-wrap"}>
                            <div className={"w-16 text-left sm:text-center sm:w-full my-auto sm:mt-auto sm:mb-0"}>
                              <FontAwesomeIcon icon={faAward} className={"text-yellow-400 text-2xl sm:text-5xl md:text-5xl"} />
                            </div>

                            <div className={"w-32 sm:w-full text-left sm:text-center sm:pt-2 my-auto"}>
                              <div className={"text-2xl font-semibold text-white uppercase"}>
                                {data.rewards.achievements.length.toLocaleString()}
                              </div>
                              <div className={"text-gray-400 text-sm md:text-base"}>{t('statistics.achievements')}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
              )}
            </div>

            <div className="flex mt-3 lg:mt-6">
              {!embed ? (
                  <a href={leaveUrl} className="button small blue">
                      <FontAwesomeIcon className="mr-1" icon={faAngleDoubleLeft} />
                      {t('button.leave')} {embed && 'Lobby'}
                  </a>
              ) : ''}
              {tournamentId && <a href={leaveUrl} className="button small orange">{t('button.ladder')}</a>}
              {!embed ? (
                  <a href={restartUrl} className={`${!tournamentId ? 'ml-auto' : ''} button small red`} >
                    {t(!isRanked ? 'button.newgame' : 'component.navbar.play' )}
                    <FontAwesomeIcon className="ml-1" icon={faAngleDoubleRight} />
                  </a>
              ) : (
                  <>
                    {embedOwner ? (
                        <button type={"button"} onClick={embedClose} className={"button small red ml-auto"}>
                          End Game
                        </button>
                    ) : (
                        <div className={"text-white text-sm uppercase font-semibold tracking-wider ml-auto pt-2"}>
                          <FontAwesomeIcon icon={faSpinner} className={"text-white mr-1"} spin />
                          Waiting on Lobby Leader
                        </div>
                    )}
                  </>
              )}
            </div>
          </div>
        </div>
      </div>
  ) : <></>;
}

export default MatchEnd;
