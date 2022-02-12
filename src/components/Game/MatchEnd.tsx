import {Fragment, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faAward, 
  faCrown,
  faBolt,
  faCircle,
  faHourglass,
  faAngleDoubleLeft,
  faAngleDoubleRight, faSpinner, faCoins, faLevelUpAlt, faTasks, faList,
} from '@fortawesome/free-solid-svg-icons';
import ReactCountUp from 'react-countup';
import {SocketGameEndData, SocketMatchData} from "../../types.client.socket";
import useConfig from "../../hooks/useConfig";
import VideoFullscreen from '../Advertisement/Units/VideoFullscreen';
import { useTranslation } from 'next-i18next';
import Chart from './MatchEnd/Chart';
import PlayerPlacement from './participants/PlayerPlacement';
import PlayerExperience from '../Player/PlayerExperience';
import ReactTooltip from 'react-tooltip';
import Replay from '../Uncategorized/Replay';


interface IProps {
  data: SocketGameEndData;
  matchData: SocketMatchData;
  
  playersLength: number;
  leaveUrl: string;
  restartUrl: string;
  embed: boolean;
  embedClose?: () => void | false;
  embedOwner?: boolean;
}

const filterDelayCSS = (index: number, incorrect: number[]) => {
    // const delayDifference = delay - average;

    if (!incorrect.includes(index))
        return 'text-white';
    
    return 'text-red-400';
}

const MatchEnd = (props: IProps) => {
    const { t } = useTranslation();
    
    const { data, matchData, leaveUrl, restartUrl, embed, embedOwner, embedClose } = props;
    const [ showRound, setShowRound ] = useState(0);

    const [ tab, setTab ] = useState('summary');
    const [ subtab, setSubtab ] = useState('overview')
    const [ toggleAd, setToggleAd ] = useState(true);

    const { useCPM, adsGameplay } = useConfig();

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
            Value: useRoundData?.Words.incorrect.length || 0,
            Icon: { name: faCircle, css: 'yellow-500' },
        },
    ];

    const tabs = [
        { name: 'Summary', tab: 'summary' },
        { name: 'Match', tab: 'match' },
    ];

    const subtabs = [
        { name: 'Statistics', tab: 'overview' },
        { name: 'Performance', tab: 'graph' },
        { name: 'Replay', tab: 'replay' }
    ];

    const boxCSS = 'p-4 lg:px-8 lg:py-4 text-center bg-gray-825 rounded-2xl shadow-md';

    return useRoundData ? (
        <div className="relative">
            <ReactTooltip />
            {(adsGameplay && toggleAd) && <VideoFullscreen toggle={() => setToggleAd(false)} />}
            <audio id="LevelUp" src="/audio/LevelUp.wav" crossOrigin="anonymous" preload="auto" />
            <audio id="LevelDown" src="/audio/LevelDown.wav" crossOrigin="anonymous" preload="auto" />

            <div className="relative">
                <div id="matchEnd">
                    <div className={"bg-gray-775 rounded-t-2xl flex flex-wrap justify-center text-white"}>
                        {tabs.map((item) => (
                            <button key={item.tab} type={"button"} onClick={() => setTab(item.tab)} className={`w-32 focus:outline-none py-2 text-sm font-semibold text-center border-b-2 ${tab === item.tab ? 'border-orange-400' : 'border-transparent'} hover:border-orange-400 transition ease-in-out duration-300`}>
                                {item.name}
                            </button>
                        ))}
                    </div>

                    <div className={"bg-black bg-opacity-20 h-auto md:min-h-128 rounded-b-2xl shadow-lg p-4 sm:p-6 md:p-8 relative"}>
                        {tab === 'summary' && (
                            <>
                                <div>
                                    <div className="flex flex-wrap justify-center lg:justify-between mb-8">
                                        <div className="h1 w-full lg:w-auto">
                                            {matchData.modeData.modeName}
                                        </div>

                                        <div className="w-full lg:w-auto">
                                            <div className="flex space-x-2">
                                                <div className="py-1 pl-2 flex justify-center bg-gray-775 rounded-lg">
                                                    <PlayerPlacement placement={1} placementFinal={1} />
                                                </div>

                                                <div className="py-1 px-2.5 flex justify-center bg-gray-775 rounded-lg" data-tip={`You are now Level ${data.level.after.Index}!`} >
                                                    <FontAwesomeIcon icon={faLevelUpAlt} className="text-teal-400 mt-1" />
                                                </div>

                                                <div className="py-1 px-2.5 flex justify-center bg-gray-775 rounded-lg" data-tip={`You have unlocked ${data.rewards.achievements.length} new achievement${data.rewards.achievements.length === 1 ? '' : 's'}!`} >
                                                    <FontAwesomeIcon icon={faAward} className="text-yellow-400 mt-1" />
                                                </div>

                                                <div className="py-1 px-2.5 flex justify-center bg-gray-775 rounded-lg" data-tip={`You have completed ${data.rewards.challenges.length} challenge${data.rewards.challenges.length === 1 ? '' : 's'}!`} >
                                                    <FontAwesomeIcon icon={faTasks} className="text-blue-400 mt-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                              <div className={`${boxCSS} mb-4`}>
                                                  <div className="flex">
                                                      <div className="w-10 text-left my-auto">
                                                          <FontAwesomeIcon icon={faCircle} className="text-yellow-400 text-2xl mt-1" />
                                                      </div>
                                                      <div className="text-left w-auto my-auto">
                                                          <div className="font-bold text-xl">{data.rewards.exp.toLocaleString()} EXP</div>
                                                      </div>
                                                  </div>
                                              </div>

                                              <div className={`${boxCSS} mb-4`}>
                                                  <div className="flex">
                                                      <div className="w-10 text-left my-auto">
                                                          <FontAwesomeIcon icon={faCoins} className="text-yellow-400 text-2xl mt-1" />
                                                      </div>
                                                      <div className="text-left w-auto my-auto">
                                                          <div className="font-bold text-xl">{data.rewards.currency.toLocaleString()} Coins</div>
                                                      </div>
                                                  </div>
                                              </div>

                                              <div className={`${boxCSS} mb-4`}>
                                                  <div className="flex">
                                                      <div className="w-10 text-left my-auto">
                                                          <FontAwesomeIcon icon={faAward} className="text-yellow-400 text-2xl mt-1" />
                                                      </div>
                                                      <div className="text-left w-auto my-auto">
                                                          <div className="font-bold text-xl">{data.rewards.achievements.length.toLocaleString()} Achievements</div>
                                                      </div>
                                                  </div>
                                              </div>

                                              <div className={`${boxCSS} mb-4`}>
                                                  <div className="flex">
                                                      <div className="w-10 text-left my-auto">
                                                          <FontAwesomeIcon icon={faList} className="text-blue-400 text-2xl mt-1" />
                                                      </div>
                                                      <div className="text-left w-auto my-auto">
                                                          <div className="font-bold text-xl">{data.rewards.challenges.length.toLocaleString()} Challenges</div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                    </div>

                                    <div className="absolute bottom-8 left-8 right-8">
                                        <PlayerExperience experience={0} level={data.level.after.Index} next={data.level.after.Next} percentage={data.level.after.Percentage} size={2} />
                                        <div className="flex justify-between mt-2">
                                            <div>Level {data.level.after.Index}</div>
                                            <div>Level {data.level.after.Index + 1}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {tab === 'match' && (
                            <>
                                <div className={"pb-8 flex flex-wrap justify-center sm:justify-between"}>
                                    <div className={"w-auto pb-4 sm:pb-0"}>
                                        <div className={"flex text-white"}>
                                            {subtabs.map((item, index) => (
                                                <button key={item.tab} type="button" onClick={() => setSubtab(item.tab)} className={`${index === 0 ? 'rounded-l-lg' : ''} ${index === 2 ? 'rounded-r-lg' : ''} transition ease-in-out duration-300 border-l border-gray-800 focus:outline-none py-2 px-3 text-sm ${subtab !== item.tab ? 'bg-gray-750' : 'bg-gray-775'} hover:bg-gray-775 animation-short`}>
                                                  {item.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={"w-auto"}>
                                        <div className={"flex text-white"}>
                                            {matchData.modeData.modeConfig.ROUNDS.LIMIT >= 1 && (
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
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <div className={"text-white text-xs sm:text-xs uppercase font-semibold"}>Title</div>
                                                                <div className={"text-orange-400 sm:text-base lg:text-lg uppercase font-semibold"}>{useRoundData.Text.source}</div>
                                                            </div>
                                                            <div>
                                                                <div className={"text-white text-xs uppercase font-semibold"}>Author</div>
                                                                <div className={"text-orange-400 sm:text-base lg:text-lg uppercase font-semibold"}>{useRoundData.Text.author}</div>
                                                            </div>
                                                            {useRoundData.Text.contributor && useRoundData.Text.contributor !== 'admin' && (
                                                                <div>
                                                                    <div className={"text-white text-xs uppercase font-semibold"}>Contributor</div>
                                                                    <div className={"text-orange-400 sm:text-base lg:text-lg uppercase font-semibold truncate"}>{useRoundData.Text.contributor}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="col-span-full mt-8 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg py-3 px-5">
                                                            <div className="inline-flex flex-wrap font-semibold">
                                                                {useRoundData.Text.content.split(' ').map((item, index) => (
                                                                    <Fragment key={index}>
                                                                        <div data-tip={`${useRoundData.Words.wpm[index] || 0}WPM`} className={`mr-2 ${filterDelayCSS(index, useRoundData.Words.incorrect)}`}>{item}</div>
                                                                    </Fragment>
                                                                ))}
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {subtab === 'graph' && <Chart {...useRoundData.Chart} />}
                                        {subtab === 'replay' && <Replay logString={useRoundData.Replay} quote={useRoundData.Text.content || ''} />}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex mt-3 lg:mt-6">
                        {!embed ? (
                            <a href={leaveUrl} className="button small blue">
                                <FontAwesomeIcon className="mr-1 my-auto" icon={faAngleDoubleLeft} />
                                {t('button.leave')} {embed && 'Lobby'}
                            </a>
                        ) : ''}
                        {matchData.tournamentId && <a href={leaveUrl} className="button small orange">{t('button.ladder')}</a>}
                        {!embed ? (
                            <a href={restartUrl} className={`${!matchData.tournamentId ? 'ml-auto' : ''} button small red`} >
                                {t(matchData.flagId !== 3 ? 'button.newgame' : 'component.navbar.play' )}
                                <FontAwesomeIcon className="ml-1 my-auto" icon={faAngleDoubleRight} />
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
