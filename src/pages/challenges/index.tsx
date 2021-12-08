import {useCallback, useEffect, useRef, useState} from "react";
import {PlayerChallengeData} from "../../types.client.mongo";
import axios, {CancelTokenSource} from "axios";
import Config from "../../Config";
import Challenge from "../../components/Challenges/Challenge";
import Pagination from "../../components/Uncategorized/Pagination";
import LeaderboardPlayerChallenges from "../../components/Leaderboard/LeaderboardPlayerChallenges";
import {useTranslation} from "next-i18next";
import {toast} from "react-toastify";
import moment from "moment";
import Countdown from "../../components/Uncategorized/Countdown";
import ComboTop from "../../components/Advertisement/Combo/ComboTop";
import ComboBottom from "../../components/Advertisement/Combo/ComboBottom";
import Base from "../../templates/Base";
import { Meta } from "../../layout/Meta";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ConfigService from "../../services/ConfigService";
import Redirect from "../../components/Uncategorized/Redirect";
import { GetServerSidePropsContext } from "next";

const getTomorrow = (created: string) => {
    const date = new Date(created);
    date.setDate(date.getDate() + 1);
    return date.getTime() / 1000;
}

const Challenges = () => {

    const { t } = useTranslation();
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    const [ redirect, setRedirect ] = useState<string>('');

    const [ challengesData, setChallengesData ] = useState<PlayerChallengeData[]>([]);
    const [ challengesLoaded, setChallengesLoaded ] = useState<boolean>(false);

    const [ leaderboardsPage, setLeaderboardsPage ] = useState<boolean>(false);
    const [ leaderboardsData, setLeaderboardsData ] = useState<PlayerChallengeData[]>([]); 
    const [ leaderboardsLoaded, setLeaderboardsLoaded ] = useState<boolean>(false);

    const [ skip, setSkip ] = useState<number>(0);

    const getChallenges = useCallback(() => {
        axios.get(`${Config.apiUrl}/player/challenges`, { withCredentials: true, cancelToken: axiosCancelSource.current?.token, })
            .then(response => {
                if (!response.data.error) {
                    setChallengesData(response.data);
                    setChallengesLoaded(true);
                } else {
                    toast.error(response.data.error);
                    setRedirect('/');
                }
            })
            .catch(e => console.log(e));
    }, []);

    const getLeaderboards = useCallback(() => {
        axios.get(`${Config.apiUrl}/leaderboards/challenges?startNum=${skip}&limit=5`, { cancelToken: axiosCancelSource.current?.token, })
            .then(response => {
                if (response.data) {
                    setLeaderboardsPage(response.data.isNextPage);
                    setLeaderboardsData(response.data.data);
                    setLeaderboardsLoaded(true);
                } 
            })
            .catch(e => console.log(e));
    }, [ skip ]);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        getChallenges();
        getLeaderboards();
        return () =>  axiosCancelSource.current?.cancel();
    }, [ getChallenges, getLeaderboards ]);

    return redirect ? <Redirect to={redirect} /> : (
        <Base meta={<Meta title="Challenges" />} ads={{ enableBottomRail: true }} isLoaded={(challengesLoaded && leaderboardsLoaded)}>
            <div className={"container"}>
                <ComboTop />
                <div className={"flex h-auto py-24 xl:py-0 xl:h-screen"}>
                    <div className={"m-auto"}>
                        <div className={"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16"}>
                            {challengesData.map((item) => (
                                <div key={item.challengeId} className={"col-span-full sm:col-span-1"}>
                                    <Challenge {...item} />
                                </div>
                            ))}
                            <div className={"col-span-full lg:col-span-2"}>
                                <div className={"bg-gray-775 shadow-lg p-6 rounded-2xl mb-6"}>
                                    <h1 className={"text-orange-400 uppercase h4 mb-3"}>{t('page.challenges.about.title')}</h1>
                                    <p className={"text-white text-lg"}>{t('page.challenges.about.text')}</p>
                                    <p className={"text-white text-lg pt-4"}>{t('page.challenges.about.text2')}</p>
                                    <p className="text-white text-lg font-semibold pt-4">{challengesData[0] ? `These challenges will reset ${moment.unix(getTomorrow(challengesData[0].created)).fromNow()}.` : ''}</p>
                                </div>
                                <div>
                                    <h2 className="mb-3 h4 uppercase text-white">
                                        {t('component.navbar.leaders')}
                                    </h2>
                                    <LeaderboardPlayerChallenges data={leaderboardsData} skip={skip} />
                                    <Countdown minuteSeconds={300} onCountdownFinish={getLeaderboards} />
                                    <Pagination isNextPage={leaderboardsPage} skip={skip} nextPage={() => setSkip(skip + 5)} prevPage={() => setSkip(skip - 5)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ComboBottom />
            </div>
        </Base>
    )
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  return {
      props: {
          ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
      }
  }
}

export default Challenges;