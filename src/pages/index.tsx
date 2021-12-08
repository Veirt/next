import {useCallback, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import Config from '../Config';
import NewsItem from "../components/News/NewsItem";
import Queue from "../components/Play/Queue";
import {
    NewsletterData,
    TournamentData,
    TwitchData
} from "../types.client.mongo";
import Countdown from "../components/Uncategorized/Countdown";
import Stream from "../components/Twitch/Stream"
import SidebarDynamicLong from "../components/Advertisement/SidebarDynamicLong";
import ComboBottom from "../components/Advertisement/Combo/ComboBottom";
import LeaderboardPlayerMatch, {PlayerMatchExtendedData} from "../components/Leaderboard/LeaderboardPlayerMatch";
import useConfig from "../hooks/useConfig";
import SidebarSquare from "../components/Advertisement/SidebarSquare";
import ComboTop from '../components/Advertisement/Combo/ComboTop';
import { Meta } from '../layout/Meta';
import Base from '../templates/Base';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfigService from '../services/ConfigService';
import { GetServerSidePropsContext } from 'next';

interface IProps {
    newsData: NewsletterData[];
    twitchData: TwitchData[];
    laddersData: TournamentData[];
    loaded: boolean;
}

const Home = (props: IProps) => {
    const { newsData, twitchData, laddersData } = props;

    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    const { t } = useTranslation();
    const { world } = useConfig();

    const [ leaderboardsLoaded, setLeaderboardsLoaded ] = useState(false);
    const [ leaderboardsData, setLeaderboardsData ] = useState<PlayerMatchExtendedData[]>([]);

    const getResults = useCallback(() => {
      axios.get(`${Config.apiUrl}/leaderboards/recent?worldId=${world}`, { withCredentials: true, cancelToken: axiosCancelSource.current?.token, })
          .then(response => {
              setLeaderboardsData(response.data);
              setLeaderboardsLoaded(true);
          })
          .catch(e => console.log(e));
  }, [ world ]);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        getResults();
        return () => axiosCancelSource.current?.cancel();
    }, [ getResults ]);

    const getLatestNewsId = typeof localStorage !== 'undefined' ? parseInt((localStorage.getItem('latestNewsId') || ''), 10) || 0 : 0;

    const socialItems = [
        {
            image: '/assets/buttons/discordbutton.webp',
            href: 'https://discord.gg/df4paUq',
        },
        {
            image: '/assets/buttons/patreonbutton.webp',
            href: 'https://patreon.com/KeymashGame',
        },
        {
            image: '/assets/buttons/merchbutton.webp',
            href: 'https://store.keyma.sh/',
        },
        {
            image: '/assets/buttons/githubbutton.webp',
            href: 'https://github.com/keyma-sh/game-tracker',
        }
    ]

    return (
        <Base meta={<Meta title={Config.slogan} />} ads={{ enableBottomRail: true }} isLoaded={leaderboardsLoaded}>
          <div className={"container container-margin py-10"}>
              <h1 className={"h3 text-white pb-6 -mt-4 uppercase"}>
                  <span className={"uppercase font-bold"}>Keyma<span className={"text-orange-400"}>.</span>sh</span> - <span className={"opacity-80"}>The future of competitive typing</span>
              </h1>
              <Queue tournamentData={laddersData} />
              <div className={"flex flex-wrap xl:flex-row"}>
                  <div className={"w-full xl:w-3/4 xl:pr-12"}>
                      <ComboTop />

                      {(leaderboardsLoaded && leaderboardsData.length !== 0) && (
                          <>
                              <h2 className="headingBox">
                                  {t('page.home.matches_high')}
                              </h2>
                              <LeaderboardPlayerMatch data={leaderboardsData} skip={0} />
                              <Countdown minuteSeconds={60} onCountdownFinish={getResults} />
                              <ComboBottom />
                          </>
                      )}
                  </div>
                  <div className={"w-full xl:w-1/4"}>
                      <div className={"grid grid-cols-1 gap-8 pt-8 xl:pt-0"}>
                          <div>
                              <h2 className="headingBox">
                                  {t('page.home.links')}
                              </h2>
                              <div className={"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3"}>
                                  {socialItems.map((item) => (
                                      <a key={item.href} href={item.href} target={"_blank"} rel={"noopener noreferrer"} className={`focus:outline-none hover:opacity-60 transition ease-in-out duration-300`}>
                                          <img className={"w-full h-auto"} src={item.image} alt={`Socials`} />
                                      </a>
                                  ))}
                              </div>
                          </div>

                          <SidebarSquare />

                          {(newsData.length !== 0) && (
                              <div>
                                  <h2 className="headingBox">
                                      {t('page.queue.titles.latestNews')}
                                  </h2>
                                  <div className={"grid grid-cols-1 gap-4"}>
                                      {newsData.map(item => <NewsItem key={item.slug} {...item} showUnread={item.increment > getLatestNewsId} isBig /> )}
                                  </div>
                              </div>
                          )}

                          {(twitchData.length !== 0) && (
                              <div>
                                  <h2 className="mb-3 py-1.5 w-56 text-center bg-gray-775 rounded-lg border-b-4 border-gray-800 text-lg md:text-xl lg:text-2xl font-bold text-white uppercase text-white">
                                      {t('page.queue.titles.streams')}
                                  </h2>
                                  {twitchData.map(row => <Stream isList key={row.name} {...row} />)}
                              </div>
                          )}

                          <SidebarDynamicLong />
                      </div>
                  </div>
              </div>
          </div>
        </Base>
    );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    const getNews = async () => {
        const response = await axios.get(`${Config.apiUrl}/newsletter/list?limit=2`).catch((e) => console.log(e))
        if (response) return response.data.data;
        else return [];
    };

    const getTwitch = async () => {
        const response = await axios.get(`${Config.gameUrl}/twitch?limit=6`).catch((e) => console.log(e))
        if (response) return response.data;
        else return [];
    };

    const getTournaments = async () => {
        const response = await axios.get(`${Config.apiUrl}/tournaments/list?locale=en&limit=3`).catch((e) => console.log(e))
        if (response) return response.data.data;
        else return [];
    };

    return {
        props: {
            ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
            twitchData: await getTwitch(),
            laddersData: await getTournaments(),
            newsData: await getNews(),
            loaded: true
        }
    }
}


export default Home;
