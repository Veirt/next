import {useCallback, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import Config from '../Config';
import NewsItem from "../components/News/NewsItem";
import {
    NewsletterData,
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
import { usePlayerContext } from '../contexts/Player.context';
import Link from '../components/Uncategorized/Link';

interface IProps {
    newsData: NewsletterData[];
    twitchData: TwitchData[];
    loaded: boolean;
}

const Home = (props: IProps) => {
    const { newsData, twitchData } = props;

    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    const { sessionData } = usePlayerContext();
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

    return (
        <Base meta={<Meta title={Config.slogan} />} ads={{ enableBottomRail: true }} isLoaded={leaderboardsLoaded}>
            {(!sessionData || sessionData?.authName === 'Guest') ? (
                <div className="flex h-screen">
                    <div className="m-auto">
                        <div className="container text-white">
                            <div className="grid grid-cols-1 xl:grid-cols-2">
                                <div>
                                    <h1 className="h1-jumbo">Competitive typing, on a whole new level</h1>
                                    <p className="py-8 text-lg">
                                        Keyma.sh is an online multiplayer typing game that allows typists from all around the world to go against each other and find out who comes on top. You can find thousands of quotes that are community supplied from books, songs, movies and more!
                                    </p>
                                    <div className="text-orange-400 font-semibold text-xl">Play now, completely free, without an account.</div>

                                    <div className="pt-6 flex flex-wrap lg:space-x-3">
                                        <Link to="/play" className="w-full lg:w-auto mb-4 lg:mb-0 button default orange">
                                            Play Now
                                        </Link>
                                        <Link to="/auth/login" className="w-full lg:w-auto flex button default lightgray">
                                            Login or Create an Account
                                        </Link>
                                    </div>
                                </div>
                                <div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={"container container-margin py-10"}>
                    <div className={"flex flex-wrap xl:flex-row"}>
                        <div className={"w-full xl:w-3/4 xl:pr-12"}>
                            <ComboTop />

                            {(leaderboardsLoaded && leaderboardsData.length !== 0) && (
                                <>
                                    <h2 className="headingBox">
                                        {t('page.home.matches_high')}
                                    </h2>
                                    <LeaderboardPlayerMatch data={leaderboardsData} skip={0} disableTrophy />
                                    <Countdown minuteSeconds={60} onCountdownFinish={getResults} />
                                    <ComboBottom />
                                </>
                            )}
                        </div>
                        <div className={"w-full xl:w-1/4"}>
                            <div className={"grid grid-cols-1 gap-8 pt-8 xl:pt-0"}>

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
            )}
        </Base>
    );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    const getNews = async () => {
        const response = await axios.get(`${Config.apiUrl}/newsletter/list?limit=3`).catch((e) => console.log(e))
        if (response) return response.data.data;
        else return [];
    };

    const getTwitch = async () => {
        const response = await axios.get(`${Config.gameUrl}/twitch?limit=6`).catch((e) => console.log(e))
        if (response) return response.data;
        else return [];
    };

    return {
        props: {
            ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
            twitchData: await getTwitch(),
            newsData: await getNews(),
            loaded: true
        }
    }
}


export default Home;
