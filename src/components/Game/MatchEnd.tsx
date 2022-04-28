import { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faAward, faCrown, faBolt, faCircle, faHourglass, faAngleDoubleLeft, faSpinner, faCoins, faLevelUpAlt, faTasks, faList, faTimes, faPlay, faTrophy, faHome, faCopy } from '@fortawesome/free-solid-svg-icons';
import ReactCountUp from 'react-countup';
import { SocketGameEndData, SocketMatchData } from '../../types.client.socket';
import useConfig from '../../hooks/useConfig';
import VideoFullscreen from '../Advertisement/Units/VideoFullscreen';
import { useTranslation } from 'next-i18next';
import Chart from './MatchEnd/Chart';
import PlayerExperience from '../Player/PlayerExperience';
import ReactTooltip from 'react-tooltip';
import Replay from '../Uncategorized/Replay';
import Ranked from './MatchEnd/Ranked';
import { toggleAds } from '../../Config';
import AchievementItem from '../Achievement/AchievementItem';
import { useGlobalContext } from '../../contexts/Global.context';
import Challenge from '../Challenges/Challenge';
import Link from '../Uncategorized/Link';
import { toast } from 'react-toastify';
import { ChallengeData, GamemodeData } from '../../types.client.mongo';

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

  if (!incorrect.includes(index)) return 'text-white';

  return 'text-red-400';
};

const MatchEnd = (props: IProps) => {
  const { t } = useTranslation();

  const { data, matchData, leaveUrl, restartUrl, embed, embedOwner, embedClose } = props;
  const [showRound, setShowRound] = useState(0);

  const [tab, setTab] = useState('summary');
  const [subtab, setSubtab] = useState('overview');
  const [toggleAd, setToggleAd] = useState(true);

  const { useCPM, adsGameplay } = useConfig();
  const { achievements, challenges, gamemodes } = useGlobalContext();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

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
    { name: 'Replay', tab: 'replay' },
  ];

  const boxCSS = 'p-4 lg:px-8 lg:py-4 text-center bg-gray-825 rounded-2xl shadow-md';

  const isPublicOrRankedMatch = matchData.flagId === 0 || matchData.flagId === 1 || matchData.flagId === 3;

  return useRoundData ? (
    <div className="relative">
      <ReactTooltip id="copyPasta" />
      <ReactTooltip id="buttons" />
      <ReactTooltip id="rewards" />
      {toggleAds && adsGameplay && toggleAd && <VideoFullscreen toggle={() => setToggleAd(false)} />}
      <audio id="LevelUp" src="/audio/LevelUp.wav" crossOrigin="anonymous" preload="auto" />
      <audio id="LevelDown" src="/audio/LevelDown.wav" crossOrigin="anonymous" preload="auto" />

      <div className="relative">
        <div id="matchEnd">
          <div className={'bg-gray-775 rounded-t-2xl flex flex-wrap justify-center text-white'}>
            {tabs.map((item) => (
              <button key={item.tab} type={'button'} onClick={() => setTab(item.tab)} className={`w-32 focus:outline-none py-2 text-sm font-semibold text-center border-b-2 ${tab === item.tab ? 'border-orange-400' : 'border-transparent'} hover:border-orange-400 transition ease-in-out duration-300`}>
                {item.name}
              </button>
            ))}
          </div>

          <div className={'bg-black bg-opacity-20 h-auto lg:min-h-128 rounded-b-2xl shadow-lg p-4 sm:p-6 md:p-8 relative'}>
            {tab === 'summary' && (
              <>
                <div>
                  <div className="flex flex-wrap justify-center lg:justify-between mb-8">
                    <div className="h1 w-full lg:w-auto">{matchData.modeData.modeName}</div>

                    <div className="w-full lg:w-auto">
                      <div className="flex space-x-2">
                        {data.level.before.Index !== data.level.after.Index && (
                          <div className="py-1 px-2.5 flex justify-center bg-gray-775 rounded-lg" data-for="rewards" data-tip={`You are now Level ${data.level.after.Index}!`}>
                            <FontAwesomeIcon icon={faLevelUpAlt} className="text-teal-400 mt-1" />
                          </div>
                        )}

                        {data.rewards.achievements.length !== 0 && (
                          <div className="py-1 px-2.5 flex justify-center bg-gray-775 rounded-lg" data-for="rewards" data-tip={`You have unlocked ${data.rewards.achievements.length} new achievement${data.rewards.achievements.length === 1 ? '' : 's'}!`}>
                            <FontAwesomeIcon icon={faAward} className="text-yellow-400 mt-1" />
                          </div>
                        )}

                        {data.rewards.challenges.length !== 0 && (
                          <div className="py-1 px-2.5 flex justify-center bg-gray-775 rounded-lg" data-for="rewards" data-tip={`You have completed ${data.rewards.challenges.length} challenge${data.rewards.challenges.length === 1 ? '' : 's'}!`}>
                            <FontAwesomeIcon icon={faTasks} className="text-blue-400 mt-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <div className={`${boxCSS} mb-4`}>
                        <div className="flex">
                          <div className="w-10 text-left my-auto">
                            <FontAwesomeIcon icon={faCircle} className="text-yellow-400 text-2xl mt-1" />
                          </div>
                          <div className="text-left w-auto my-auto">
                            <div className="font-bold text-base sm:text-lg md:text-xl">{data.rewards.exp.toLocaleString()} EXP</div>
                          </div>
                        </div>
                      </div>

                      <div className={`${boxCSS} mb-4`}>
                        <div className="flex">
                          <div className="w-10 text-left my-auto">
                            <FontAwesomeIcon icon={faCoins} className="text-yellow-400 text-2xl mt-1" />
                          </div>
                          <div className="text-left w-auto my-auto">
                            <div className="font-bold text-base sm:text-lg md:text-xl">{data.rewards.currency.toLocaleString()} Coins</div>
                          </div>
                        </div>
                      </div>

                      <div className={`${boxCSS} mb-4`}>
                        <div className="flex">
                          <div className="w-10 text-left my-auto">
                            <FontAwesomeIcon icon={faAward} className="text-yellow-400 text-2xl mt-1" />
                          </div>
                          <div className="text-left w-auto my-auto">
                            <div className="font-bold text-base sm:text-lg md:text-xl">{data.rewards.achievements.length.toLocaleString()} Achievements</div>
                          </div>
                        </div>
                      </div>

                      <div className={`${boxCSS} mb-4`}>
                        <div className="flex">
                          <div className="w-10 text-left my-auto">
                            <FontAwesomeIcon icon={faList} className="text-blue-400 text-2xl mt-1" />
                          </div>
                          <div className="text-left w-auto my-auto">
                            <div className="font-bold text-base sm:text-lg md:text-xl">{data.rewards.challenges.length.toLocaleString()} Challenges</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-full lg:col-span-2 mb-4">
                      <div className={`${boxCSS} h-full hidden lg:flex`}>
                        <div className="my-auto w-full">
                          {matchData.flagId === 3 ? (
                            <>
                              <Ranked {...data.ranked} />
                            </>
                          ) : (
                            <>
                              {data.rewards.achievements.length === 0 && data.rewards.challenges.length === 0 ? (
                                <div>
                                  If you believe in yourself and have dedication and pride - and never quit, you'll be a winner. The price of victory is high but so are the rewards.
                                  <div className="font-semibold">- Bear Bryant</div>
                                </div>
                              ) : (
                                <>
                                  <div className="h3 mb-6 text-left">Rewards</div>
                                  <div className="h-48 overflow-y-scroll pr-8">
                                    <div className="grid grid-cols-1 gap-8">
                                      {data.rewards.achievements.map((item, index) => (
                                        <div key={index}>
                                          {/* @ts-ignore */}
                                          <AchievementItem {...achievements[item as any]} value={1} created={Math.round(new Date().getTime() / 1000 - 15)} />
                                        </div>
                                      ))}

                                      {data.rewards.challenges.map((item, index) => (
                                        <div key={index}>
                                          {/* @ts-ignore */}
                                          <Challenge mini {...challenges[item as any]} mode={[gamemodes[challenges[item as any]?.modeId || 0] as GamemodeData]} challenge={[challenges[item as any] as ChallengeData]} />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isPublicOrRankedMatch ? (
                    <div className="absolute left-4 bottom-4 right-4 sm:left-6 sm:bottom-6 sm:right-6 md:bottom-8 md:left-8 md:right-8">
                      <PlayerExperience experience={0} level={data.level.after.Index} next={data.level.after.Next} percentage={data.level.after.Percentage} size={2} />
                      <div className="flex justify-between mt-2">
                        <div>Level {data.level.after.Index}</div>
                        <div>Level {data.level.after.Index + 1}</div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            )}
            {tab === 'match' && (
              <>
                <div className={'pb-8 flex flex-wrap justify-center md:justify-between'}>
                  <div className={'w-auto pb-4 sm:pb-0'}>
                    <div className={'flex flex-wrap text-white'}>
                      {subtabs.map((item, index) => (
                        <button
                          key={item.tab}
                          type="button"
                          onClick={() => setSubtab(item.tab)}
                          className={`w-full xs:w-auto ${index === 0 ? 'xs:rounded-l-lg' : ''} ${index === 2 ? 'xs:rounded-r-lg' : ''} transition ease-in-out duration-300 focus:outline-none py-2 px-4 text-sm ${subtab !== item.tab ? 'bg-gray-775' : 'bg-gray-800'} hover:bg-gray-800 animation-short`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={'w-auto'}>
                    <div className={'flex text-white'}>
                      {matchData.modeData.modeConfig.ROUNDS.LIMIT >= 1 &&
                        [...Array(data?.roundData.length || 0)].map((_i, k) => (
                          <button key={k} type="button" onClick={() => setShowRound(k)} className={`transition ease-in-out duration-300 border-l border-gray-800 focus:outline-none py-2 px-3 text-sm ${showRound !== k ? 'bg-gray-750' : 'bg-gray-775'} hover:bg-gray-775 animation-short`}>
                            Round {k + 1}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
                {useRoundData && (
                  <div className={'text-white'}>
                    {subtab === 'overview' && (
                      <div className={'grid grid-cols-1 sm:grid-cols-3 gap-8'}>
                        <div className={'col-span-full md:col-span-1'}>
                          <div className={'grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 gap-4'}>
                            {rows.map((stat) => (
                              <div key={stat.Name} className={'relative bg-gray-825 shadow-md rounded-2xl px-5 py-3'}>
                                <div className={'uppercase text-xs font-semibold text-white'}>{t(stat.Name)}</div>
                                <div className={'text-xl sm:text-2xl md:text-3xl lg:text-4xl text-orange-400 font-bold'}>
                                  <ReactCountUp start={0} end={stat.Value || 0} decimal={'.'} decimals={['statistics.time', 'statistics.wpm', 'statistics.cpm'].includes(stat.Name) ? 2 : 0} />
                                  <span className={'text-2xl'}>{stat.Extension}</span>
                                </div>
                                {['statistics.wpm', 'statistics.cpm'].includes(stat.Name) && data.personalBest ? (
                                  <div className={'absolute top-0 right-0 mt-8 mr-4'} data-for="pbReward" data-tip="New Personal Best for this Text!">
                                    <FontAwesomeIcon icon={faCrown} className={'text-yellow-400'} />
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className={'col-span-full md:col-span-2'}>
                          <div className={'mb-4 p-5 bg-gray-825 rounded-2xl shadow-md hidden lg:block relative'}>
                            {useRoundData?.Text?.content && (
                              <button
                                type="button"
                                data-for="copyPasta"
                                data-tip="Copy Text Content to Clipboard"
                                onClick={() => {
                                  toast.success('Copied to clipboard!');
                                  navigator?.clipboard.writeText(useRoundData.Text.content);
                                }}
                                className="absolute bottom-5 right-6 text-sm font-semibold text-orange-400 hover:opacity-70 transition ease-in-out duration-300"
                              >
                                <FontAwesomeIcon icon={faCopy} className="text-xl" />
                              </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className={'text-white text-xs sm:text-xs uppercase font-semibold'}>Title</div>
                                <div className={'text-orange-400 sm:text-base lg:text-lg uppercase font-semibold'}>{useRoundData.Text.source}</div>
                              </div>
                              <div>
                                <div className={'text-white text-xs uppercase font-semibold'}>Author</div>
                                <div className={'text-orange-400 sm:text-base lg:text-lg uppercase font-semibold'}>{useRoundData.Text.author}</div>
                              </div>
                              {useRoundData.Text.contributor && useRoundData.Text.contributor !== 'admin' && (
                                <div>
                                  <div className={'text-white text-xs uppercase font-semibold'}>Contributor</div>
                                  <div className={'text-orange-400 sm:text-base lg:text-lg uppercase font-semibold truncate'}>{useRoundData.Text.contributor}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-3 bg-gray-825 rounded-2xl shadow-md hidden md:block">
                            <div className="inline-flex flex-wrap">
                              {useRoundData.Text.content.split(' ').map((item, index) => (
                                <Fragment key={index}>
                                  <div className={`px-2 bg-white rounded-lg hover:bg-opacity-20 bg-opacity-0 transition ease-in-out duration-100 ${filterDelayCSS(index, useRoundData.Words.incorrect)}`}>{item}</div>
                                </Fragment>
                              ))}
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

          <div className="flex justify-between mt-3 lg:mt-6">
            {!embed ? (
              <Link to={leaveUrl} data-tip="Leave Game" className="button small blue">
                <FontAwesomeIcon className="my-1" icon={faAngleDoubleLeft} />
              </Link>
            ) : (
              ''
            )}
            {matchData.tournamentId && (
              <a data-for="buttons" data-tip="Back to Competition page" href={leaveUrl} className="button small orange">
                <FontAwesomeIcon icon={faTrophy} />
              </a>
            )}
            {!embed ? (
              <Link to={restartUrl} data-tip={`${matchData.flagId !== 3 ? 'Play another game' : 'Return to Home'}`} className={`button small red`}>
                <FontAwesomeIcon className="my-1" icon={matchData.flagId !== 3 ? faPlay : faHome} />
              </Link>
            ) : (
              <>
                {embedOwner ? (
                  <button data-for="buttons" data-tip="End Game" type={'button'} onClick={embedClose} className={'button small red'}>
                    <FontAwesomeIcon className="my-1" icon={faTimes} />
                  </button>
                ) : (
                  <div data-for="buttons" data-tip="Waiting for Lobby Leader" className={'text-white text-sm uppercase font-semibold tracking-wider pt-2'}>
                    <FontAwesomeIcon className="my-1" icon={faSpinner} spin /> Waiting for Leader
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default MatchEnd;
