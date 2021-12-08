import {useState, useEffect, useRef, useCallback} from 'react';
import { useTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import Config from '../../Config';
import ComboBottom from "../../components/Advertisement/Combo/ComboBottom";
import DesktopTop from "../../components/Advertisement/DesktopTop";
import {
  PlayerExtendedData,
  PlayerStatisticData,
} from "../../types.client.mongo";
import useConfig from "../../hooks/useConfig";
import {toast} from "react-toastify";
import PlayerAvatar from "../../components/Player/PlayerAvatar";
import ProfileAchievements, {PlayerAchievementExtendedData} from "../../components/Profile/ProfileAchievements";
import ProfileTournaments, {PlayerTournamentExtendedData} from "../../components/Profile/ProfileTournaments";
import LeaderboardPlayerProfile, {PlayerMatchProfileExtendedData} from "../../components/Leaderboard/LeaderboardPlayerProfile";
import Pagination from "../../components/Uncategorized/Pagination";
import ProfileStatistics from "../../components/Profile/ProfileStatistics";
import PlayerName from "../../components/Player/PlayerName";
import Base from '../../templates/Base';
import { Meta } from '../../layout/Meta';
import { GetServerSidePropsContext } from 'next';
import ConfigService from '../../services/ConfigService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PlayerStatisticChartData } from '../../components/Profile/ProfileStatisticChart';
import { PlayerRankedExtendedData } from '../../components/Leaderboard/LeaderboardPlayerRanked';

interface IProps {
    playerData: PlayerExtendedData;
    statisticData: PlayerStatisticData;
    chartData: PlayerStatisticChartData;
    rankedData: PlayerRankedExtendedData;
    achievementsData: PlayerAchievementExtendedData[];
    tournamentsData: PlayerTournamentExtendedData[];
}

const Profile = ({ playerData, statisticData, chartData, rankedData, achievementsData, tournamentsData }: IProps) => {

  const axiosCancelSource = useRef<CancelTokenSource | null>(null);
  const { t } = useTranslation();
  const { world } = useConfig();

  // Player data
  const [ tab, setTab ] = useState('statistics');
  const [ loaded, setLoaded ] = useState<boolean>(false);

  // Match leaderboards
  const [ limit ] = useState<number>(30);
  const [ skip, setSkip ] = useState<number>(0);
  const [ matchData, setMatchData ] = useState<PlayerMatchProfileExtendedData[]>([]);
  const [ matchNextPage, setMatchNextPage ] = useState<boolean>(true);

  const getMatches = useCallback(() => {
    if (!playerData)
      return false;

    axios.get(`${Config.apiUrl}/player/matches?playerId=${playerData.playerId}&worldId=${world}&limit=${limit}&startNum=${skip}`, { cancelToken: axiosCancelSource.current?.token, })
        .then((response) => {
            if (!response.data.error) {
                setMatchData(response.data.data);
                setMatchNextPage(response.data.isNextPage);
                setLoaded(true);
            } else toast.error(response.data.error);
        })
        .catch(() => toast.error("Unable to pull recent matches!"));

    return () => false;
  }, [ playerData, skip, limit, world ]);

  useEffect(() => {
      axiosCancelSource.current = axios.CancelToken.source();
      getMatches();
      return () => axiosCancelSource.current?.cancel();
  }, [ getMatches ]);

  useEffect(() => {
    getMatches();
  }, [ getMatches ]);

  const profileItems = [
    {
      name: 'General',
      tab: 'statistics',
      onClick: () => setTab('statistics')
    },
    {
      name: 'Matches',
      tab: 'matches',
      onClick: () => setTab('matches')
    },
    {
      name: 'Achievements',
      tab: 'achievements',
      onClick: () => setTab('achievements')
    },
    {
      name: 'Tournaments',
      tab: 'tournaments',
      onClick: () => setTab('tournaments')
    }
  ]

  return (
      <Base meta={<Meta title={`${playerData.name}#${playerData.discriminator}'s Profile`} description={(playerData?.description.substr(0, 200) + '...') || ''} customImage={playerData?.avatarSrc || ''} reverseTitle />} isLoaded={loaded} ads={{ enableBottomRail: true }}>
          <div className={"container-margin"}>
              <div className={"relative rounded"} style={{ backgroundImage: `url('/banners/${playerData?.banner}.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className={"container"}>
                    <div className={"h-10"} />
                        <div className={"flex flex-wrap pt-16"}>
                            <div className={"w-full xl:w-auto"}>
                                <div className={"flex justify-center xl:justify-start"}>
                                    <div className={"w-16 sm:w-24 lg:w-40 xl:w-52 mt-2 sm:mt-0"}>
                                        <div className={"xl:-mb-6 m-auto w-14 h-14 sm:w-20 sm:h-20 lg:w-32 lg:h-32 xl:w-44 xl:h-44"}>
                                            <PlayerAvatar source={playerData?.avatarSrc} border={4} color={playerData?.cardBorder} />
                                        </div>
                                    </div>
                                <div className={"w-auto mt-auto pl-3 lg:pl-0"}>
                                    {(playerData && playerData.name) && <PlayerName showDiscriminator useBig name={playerData.name} discriminator={playerData.discriminator} staff={playerData.staff} verified={playerData.verified} patreon={playerData.patreon} />}
                                        <div className={"mt-2 lg:mt-5 w-48 lg:w-64"}>
                                            <div className={"rounded-full bg-gray-750 h-2"}>
                                                <div className={"rounded-full bg-orange-400 h-2"} style={{ width: `${playerData?.Level.Percentage}%` }} />
                                            </div>
                                            <div className={"flex pt-1"}>
                                                <div className={"font-semibold text-xs lg:text-sm uppercase text-white w-auto mr-auto"}>
                                                    {playerData?.experience.toLocaleString()} / {playerData?.Level.Next.toLocaleString()}
                                                </div>
                                                <div className={"font-semibold text-xs lg:text-sm uppercase text-white w-auto"}>
                                                    Level {playerData?.Level?.Index}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"w-full xl:w-5/12 ml-auto mt-auto"}>
                                <div className={"m-auto mb-3 rounded-xl pt-10 pb-10 font-semibold text-center text-white text-sm xl:text-base bg-black bg-opacity-50"}>{playerData?.description}</div>
                                <div className={"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 bg-gray-750 shadow-lg mb-4 rounded-xl"}>
                                    {profileItems.map((item, index) => (
                                        <button key={item.tab} onClick={item.onClick} className={`${index === 0 ? 'rounded-l-xl' : ''} ${index === profileItems.length ? 'rounded-r-xl' : ''} ${item.tab === tab ? 'bg-gray-775 bg-opacity-70' : ''} block text-center text-white uppercase font-semibold tracking-wider text-xxs sm:text-xs lg:text-sm py-2.5 focus:outline-none hover:border-orange-400 transition ease-in-out duration-300`}>
                                          {item.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"container pt-6"}>
                <div className={"py-6"}>
                    <DesktopTop />
                    {tab === 'statistics' && <ProfileStatistics profileData={playerData} chartData={chartData} statisticData={statisticData} rankedData={rankedData || null} />}
                    {tab === 'matches' && (
                        <>
                          <h2 className={"headingBox"}>{t('component.navbar.recent_matches')}</h2>
                          {matchData && matchData.length !== 0 ? (
                              <>
                                <LeaderboardPlayerProfile data={matchData} skip={skip} />
                                <Pagination isNextPage={matchNextPage} skip={skip} nextPage={() => setSkip(skip + limit)} prevPage={() => setSkip(skip - limit)} />
                              </>
                          ) : (
                              <div className={"text-center text-lg bg-gray-750 py-32 uppercase font-semibold text-white"}>
                                This player has not played any matches.
                              </div>
                          )}
                        </>
                    )}
                    {tab === 'achievements' && <ProfileAchievements data={achievementsData} />}
                    {tab === 'tournaments' && <ProfileTournaments data={tournamentsData} />}
                    <ComboBottom />
                </div>
            </div>
      </Base>
  )
}

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    const id = encodeURI(String(params?.id || ''));
    const world = ConfigService.getWorld();

    const getPlayer = await axios.get(`${Config.apiUrl}/player/info?name=${id}`).catch((e) => console.log(e));
    if (getPlayer && !getPlayer.data.error) {
        const getStatistics = await axios.get(`${Config.apiUrl}/player/statistics?playerId=${getPlayer.data.playerId}&worldId=${world}`).catch((e) => console.log(e));
        const getChart = await axios.get(`${Config.apiUrl}/player/chart?playerId=${getPlayer.data.playerId}&worldId=${world}`).catch((e) => console.log(e));
        const getAchievements = await axios.get(`${Config.apiUrl}/player/achievements?playerId=${getPlayer.data.playerId}`).catch((e) => console.log(e));
        const getTournaments = await axios.get(`${Config.apiUrl}/player/tournaments?playerId=${getPlayer.data.playerId}&worldId=${world}`).catch((e) => console.log(e));
        const getRanked = await axios.get(`${Config.apiUrl}/player/ranked?playerId=${getPlayer.data.playerId}&worldId=${world}`).catch((e) => console.log(e));
    
        return {
            props: {
                ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
                playerData: getPlayer?.data || null,
                statisticData: getStatistics?.data || null,
                chartData: getChart?.data || null,
                achievementsData: getAchievements?.data || [],
                tournamentsData: getTournaments?.data || [],
                rankedData: getRanked?.data || null,
            }
        }
      } else {
          return {
            notFound: true
          }
      }

}

export default Profile;
