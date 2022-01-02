import {useCallback, useEffect, useRef, useState} from 'react';
import { Line } from 'react-chartjs-2';
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
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import ReactCountUp from 'react-countup';
import {ChartOptions} from "chart.js";
import {SocketMatchEndData} from "../../types.client.socket";
import useConfig from "../../hooks/useConfig";
import ReactTooltip from "react-tooltip";
import VideoFullscreen from '../../components/Advertisement/VideoFullscreen';
import { useTranslation } from 'next-i18next';

interface EndMatchFormatRow {
  Name: string;
  Value: number;
  Extension?: string;
  Icon: { name: IconDefinition; css: string };
}

interface IProps {
  data: SocketMatchEndData | null;
  lobbyReferral: string;
  tournamentId?: string;
  playersLength: number;
  isRanked: boolean;
  isRounds: boolean;
  isMode: number;
  showRewards: boolean;
  leaveUrl: string;
  restartUrl: string;
  embed: boolean;
  embedClose?: () => void | false;
  embedOwner?: boolean;
}

const MatchEnd = (props: IProps) => {
  const { t } = useTranslation();
  
  const [ hideRanked, setHideRanked ] = useState(false);
  const [ showRound, setShowRound ] = useState(0);

  const [ tab, setTab ] = useState('match');
  const [ subtab, setSubtab ] = useState('overview')
  const [ toggleAd, setToggleAd ] = useState(true);

  const { useCPM, rankUpSound, rankDownSound, adsGameplay } = useConfig();

  const rankInterval = useRef<NodeJS.Timeout | null>(null);
  const hideInterval = useRef<NodeJS.Timeout | null>(null);
  const textInterval = useRef<NodeJS.Timeout | null>(null);

  const { showRewards, isRounds, isRanked, isMode, tournamentId, data, leaveUrl, restartUrl, embed, embedOwner, embedClose } = props;

  const playAnimation = useCallback(() => {
    const hideRankElement = document.getElementById('hideRank');
    const showRankElement = document.getElementById('showRank');
    const showRankUp = document.getElementById('showRankUp');
    const showRankDown = document.getElementById('showRankDown');

    if (data && hideRankElement && showRankElement) {
      // Check on Rank
      // if = if your old SR is greater than your new SR = Lost SR
      // if = if your old SR is less than your new SR = Won SR
      if (data.CompetitiveNew.Remaining <= 0) {
        if (data.CompetitiveNew.Remaining < 0 && data.Competitive.Rank !== data.CompetitiveNew.Rank && data.Competitive.SR > data.CompetitiveNew.SR) {
          if (showRankDown && !textInterval.current) {
            textInterval.current = setTimeout(() => {
              showRankDown.style.opacity = '1';
            }, 500);
          }

          if (rankDownSound)
            (document.getElementById('LevelDown') as HTMLAudioElement)?.play();
        } else if ((data.CompetitiveNew.Remaining <= 0 && data.Competitive.Rank !== data.CompetitiveNew.Rank && data.Competitive.SR < data.CompetitiveNew.SR) || data.CompetitiveNew.Remaining === 0) {
          if (showRankUp && !textInterval.current) {
            textInterval.current = setTimeout(() => {
              showRankUp.style.opacity = '1';
            }, 500);
          }

          if (rankUpSound)
            (document.getElementById('LevelUp') as HTMLAudioElement)?.play();
        }
      }

      // ------------------
      hideRankElement.style.opacity = '0';
      showRankElement.style.opacity = '1';
      if (!hideInterval.current) {
        hideInterval.current = setTimeout(() => setHideRanked(true), 3000);
      }
    }
  }, [ data, textInterval, hideInterval, rankUpSound, rankDownSound ]);

  useEffect(() => {
    if (isRanked && !rankInterval.current) {
      rankInterval.current = setTimeout(() => playAnimation(), 4000);
    }

    return () => {
      if (rankInterval.current)
        clearInterval(rankInterval.current);

      if (textInterval.current)
        clearInterval(textInterval.current);

      if (hideInterval.current)
        clearInterval(hideInterval.current);
    }
  }, [ rankInterval, textInterval, hideInterval, isRanked, playAnimation ]);

  const useRoundData = (data && data.roundData) ? data.roundData[showRound] : undefined;
  if (data && data.roundData && typeof useRoundData !== 'undefined') {
      const maxRounds = data.roundData.length;

      let chartLabel = 'Words Per Minute';
      const newChartData: number[] = useRoundData.Chart.wpm;
      if (useCPM === '1') {
          chartLabel = 'Characters Per Minute';
          const dataLength: number = useRoundData.Chart.wpm.length;
          for (let i = 0; i < dataLength; i++) {
              // @ts-ignore
              newChartData[i] = Math.round((newChartData[i] * 5 + Number.EPSILON) * 100) / 100;
          }
      }

      const lineData: any = {
        type: 'line',
        labels: useRoundData.Chart.labels,
        datasets: [
          {
            yAxisID: 'A',
            label: chartLabel,
            fill: true,
            lineTension: 0.25,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(246, 173, 85, 0.5)',
            borderWidth: '3',
            borderCapStyle: 'butt',
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(246, 173, 85, 0.7)',
            pointBackgroundColor: 'rgba(246, 173, 85, 1)',
            pointBorderWidth: 1,
            pointHoverRadius: 7,
            pointRadius: 5,
            pointHitRadius: 500,
            data: newChartData,
          },
          {
            yAxisID: 'B',
            label: 'Second per Word',
            fill: true,
            lineTension: 0.25,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(43, 108, 176, 0)',
            borderWidth: '3',
            borderCapStyle: 'butt',
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(43, 108, 176, 0.7)',
            pointBackgroundColor: 'rgba(43, 108, 176, 1)',
            pointBorderWidth: 3,
            pointHoverRadius: 4,
            pointRadius: 4,
            pointHitRadius: 12,
            data: useRoundData.Chart.word,
          },
        ],
      };

      const lineOptions: ChartOptions = {
        animation: {
          duration: (isRanked || isRounds) ? 0 : 1000
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              id: 'A',
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: chartLabel
              }
            },
            {
              id: 'B',
              position: 'right',
              scaleLabel: {
                display: true,
                labelString: 'Seconds Per Word'
              }
            }
          ]
        }
      };

      const rows: EndMatchFormatRow[] = [
        {
          Name: useCPM === '0' ? 'statistics.wpm' : 'statistics.cpm',
          Value: useCPM === '0' ? useRoundData.WPM : parseFloat((useRoundData.WPM * 5).toFixed(2)),
          Icon: { name: faBolt, css: 'blue-500' },
        },
        {
          Name: 'statistics.accuracy',
          Value: useRoundData.Accuracy,
          Extension: '%',
          Icon: { name: faBullseye, css: 'orange-500' },
        },
        {
          Name: 'statistics.time',
          Value: useRoundData.ElapsedTime,
          Extension: 's',
          Icon: { name: faHourglass, css: 'teal-500' },
        },
        {
          Name: 'statistics.mistakes',
          Value: useRoundData.Mistakes,
          Icon: { name: faCircle, css: 'yellow-500' },
        },
      ];

      const tabs = [
        { name: 'Match', tab: 'match' },
        { name: 'Rewards', tab: 'rewards' }
      ];

      const subtabs = [
        { name: 'Overview', tab: 'overview' },
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
              {/* Ranked */}
              {isRanked && !hideRanked && (
                  <div id="matchRank">
                    <div className="absolute left-0 top-0 right-0 bottom-0 z-50 rounded">
                      <div className={`absolute w-full h-full rankBackdrop`} />
                      <div className="flex h-full">
                        <div className="m-auto text-center z-50">
                          {data.CompetitiveNew.Remaining <= 0 && (
                              <div className="uppercase text-white font-semibold text-2xl tracking-wider">
                                {(data.CompetitiveNew.Remaining <= 0 && data.CompetitiveNew.Rank !== data.Competitive.Rank && data.Competitive.SR < data.CompetitiveNew.SR) || data.CompetitiveNew.Remaining === 0 ? (
                                    <div id="showRankUp" style={{ opacity: 0 }} className={"transition-all ease-in-out duration-500"}>
                                      You have been promoted to {data.CompetitiveNew.Rank}!
                                    </div>
                                ) : (
                                    <div id="showRankDown" style={{ opacity: 0 }} className={"transition-all ease-in-out duration-500"}>
                                      You have been demoted to {data.CompetitiveNew.Rank}.
                                    </div>
                                )}
                              </div>
                          )}
                          <div className="relative py-5">
                            {data.CompetitiveNew.Remaining < 0 ? (
                                <>
                                  <div id="showRank" style={{ opacity: 0 }} className="absolute w-full transition-all ease-in-out duration-1000">
                                    <img
                                        src={`/ranks/unranked.png`}
                                        className="mx-auto w-48 h-48"
                                        alt="skillrank unranked"
                                    />
                                  </div>
                                  <div id="hideRank" style={{ opacity: 1 }} className="absolute w-full transition-all ease-in-out duration-1000">
                                    <img
                                        src={`/ranks/unranked.png`}
                                        className="mx-auto w-48 h-48"
                                        alt="skillrank unranked"
                                    />
                                  </div>
                                </>
                            ) : (
                                <>
                                  <div id="showRank" style={{ opacity: 0 }} className="absolute w-full transition-all ease-in-out duration-500">
                                    <img
                                        src={`/ranks/${data.CompetitiveNew.Rank.toLowerCase()}.png`}
                                        className="mx-auto w-48 h-48"
                                        alt="skillrank new"
                                    />
                                  </div>
                                  <div id="hideRank" style={{ opacity: 1 }} className="absolute w-full transition-all ease-in-out duration-500">
                                    <img
                                        src={`/ranks/${data.Competitive.Rank.toLowerCase()}.png`}
                                        className="mx-auto w-48 h-48"
                                        alt="skillrank current"
                                    />
                                  </div>
                                </>
                            )}
                            <div className="w-48 h-48" />
                          </div>
                          <div className="text-uppercase text-center text-4xl text-white font-bold tracking-wider">
                            {data.CompetitiveNew.Remaining >= 1
                                ? <>{data.CompetitiveNew.Games} <span className="text-gray-400">/</span> {data.CompetitiveNew.Games + data.CompetitiveNew.Remaining}</>
                                : data.CompetitiveNew.Remaining < 0 ? (
                                    <>
                                      <ReactCountUp start={data.Competitive.SR} end={data.CompetitiveNew.SR} duration={5} />
                                      <span className="text-orange-400 text-2xl">SR</span>
                                      <div className="text-3xl">
                                          <span className={Math.sign(data.CompetitiveNew.SR - data.Competitive.SR) == -0 || Math.sign(data.CompetitiveNew.SR - data.Competitive.SR) === -1 ? 'text-red-400' : 'text-green-400'}>
                                            {Math.sign(data.CompetitiveNew.SR - data.Competitive.SR) == -0 || Math.sign(data.CompetitiveNew.SR - data.Competitive.SR) === -1 ? '' : '+'}
                                            {data.CompetitiveNew.SR - data.Competitive.SR}
                                          </span>
                                      </div>
                                    </>
                                ) : <>{data.CompetitiveNew.SR}<span className="text-orange-400 text-2xl">SR</span></>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

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
                              {isMode === 1 && maxRounds > 1 && (
                                  [...Array(maxRounds)].map((_i, k) => (
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
                                                  <ReactCountUp start={0} end={stat.Value} decimal={'.'} decimals={['statistics.time', 'statistics.wpm', 'statistics.cpm'].includes(stat.Name) ? 2 : 0} />
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
                                          {useRoundData.Text.textSourceSource !== 'CUSTOM_TEXT' ? (
                                              <div className={"flex flex-wrap"}>
                                                <div className={"w-full md:w-1/2 lg:w-1/3"}>
                                                  <div>
                                                    <div className={"text-white text-xs sm:text-xs uppercase font-semibold"}>Title</div>
                                                    <div className={"text-orange-400 sm:text-base lg:text-lg uppercase font-semibold"}>{useRoundData.Text.textSourceSource}</div>
                                                  </div>
                                                  <div className={"mt-4"}>
                                                    <div className={"text-white text-xs uppercase font-semibold"}>Author</div>
                                                    <div className={"text-orange-400 sm:text-base lg:text-lg uppercase font-semibold"}>{useRoundData.Text.textSourceAuthor}</div>
                                                  </div>
                                                  {useRoundData.Text.textSourceContributor && useRoundData.Text.textSourceContributor !== 'admin' && (
                                                      <div className={"mt-4"}>
                                                        <div className={"text-white text-xs uppercase font-semibold"}>Contributor</div>
                                                        <div className={"text-orange-400 sm:text-base lg:text-lg uppercase font-semibold truncate"}>{useRoundData.Text.textSourceContributor}</div>
                                                      </div>
                                                  )}
                                                </div>
                                                <div className={"w-full md:w-1/2 lg:w-2/3 my-auto md:pl-4"}>
                                                  <div className={"border-l-2 border-orange-400 pl-4 py-2 mt-4 sm:mt-0 text-xs lg:text-sm"}>
                                                    {useRoundData.Text.textContent}
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

                            {subtab === 'graph' && (
                                <div style={{ zIndex: -1 }} className="w-full h-full text-gray-100 text-center bg-gray-825 rounded-lg px-2 py-3.5" >
                                  <div style={{ height: '350px' }}>
                                      <Line data={lineData} options={lineOptions} redraw={isRanked || isRounds} />
                                  </div>
                                </div>
                            )}
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
                                    {data.calculateCurrency.toLocaleString()}
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
                                    {data.calculateEXP.toLocaleString()}
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
                                    {data.achievementsUnlocked.toLocaleString()}
                                  </div>
                                  <div className={"text-gray-400 text-sm md:text-base"}>{t('statistics.achievements')}</div>
                                </div>
                              </div>
                            </div>
                            {data.levelBefore && data.levelAfter && data.levelBefore.Index !== data.levelAfter.Index && <div className={"text-base lg:text-lg uppercase font-bold text-white mt-10 mb-8 md:mb-0"}>{t('statistics.levelUp')} Level {data.levelAfter.Index}!</div>}
                          </div>
                      </div>
                  )}
                </div>

                <div className="flex mt-3 lg:mt-6">
                  {!embed ? (
                    <a href={leaveUrl} className="btn btn--blue btn--border-r">
                      <FontAwesomeIcon className="mr-1" icon={faAngleDoubleLeft} />
                      {t('button.leave')} {embed && 'Lobby'}
                    </a>
                  ) : ''}
                  {tournamentId && <a href={leaveUrl} className="btn btn--orange btn--border-x mx-auto">{t('button.ladder')}</a>}
                  {!embed ? (
                      <a href={restartUrl} className={`${!tournamentId ? 'ml-auto' : ''} btn btn--red`} >
                        {t(!isRanked ? 'button.newgame' : 'component.navbar.play' )}
                        <FontAwesomeIcon className="ml-1" icon={faAngleDoubleRight} />
                      </a>
                  ) : (
                      <>
                        {embedOwner ? (
                            <button type={"button"} onClick={embedClose} className={"btn btn--red ml-auto"}>
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
  } else return <div className={"text-3xl text-white"}>There was an error showing your match statistics, please contact support.</div>;
}

export default MatchEnd;
