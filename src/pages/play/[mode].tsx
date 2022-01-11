import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import AdvertisementDisplay from "../../components/Advertisement/AdvertisementDisplay";
import DesktopDynamicFooter from "../../components/Advertisement/DesktopDynamicFooter";
import DesktopDynamicTop from "../../components/Advertisement/DesktopDynamicTop";
import SidebarLong from "../../components/Advertisement/SidebarLong";
import Challenges from "../../components/Play/Challenges";
import Guest from "../../components/Play/Guest";
import Leaderboards from "../../components/Play/Leaderboards";
import Queue from "../../components/Play/Queue";
import Social from "../../components/Play/Social";
import Tournaments from "../../components/Play/Tournaments";
import Config from "../../Config";
import { Meta } from "../../layout/Meta";
import ConfigService from "../../services/ConfigService";
import Base from "../../templates/Base";
import { NewsletterData, PlayerChallengeData, TournamentData } from "../../types.client.mongo";

interface IProps {
    mode: string;
    newsData: NewsletterData[];
    tournamentsData: TournamentData[];
    challengesData: PlayerChallengeData[];
    loaded: boolean;
}

const Play = (props: IProps) => {
    const { mode, challengesData, tournamentsData, loaded } = props;

    return (
        <Base meta={<Meta title="Take your typing to the next level" />} ads={{ enableBottomRail: true }} isLoaded={loaded}>
            
            <div className="absolute left-2 top-15">
                <SidebarLong />
            </div>
            <div className="absolute right-2 top-15">
                <SidebarLong />
            </div>

            <div className="container container-margin container-content">
                <div className="mb-4">
                    <FontAwesomeIcon icon={faBullhorn} className="mr-1 text-yellow-400" />
                    <span className="font-semibold mr-2">January 1, 2022:</span>
                    Ranked Matchmaking's Future
                </div>
                <Queue mode={mode}/>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
                    {(challengesData && challengesData.length !== 0) ? (
                        <div className="content-box 4xl:h-136">
                            <Challenges data={challengesData} />
                        </div>
                    ) : (
                        <div className="content-box 4xl:h-136">
                            <Guest />
                        </div>
                    )}
                    
                    <div className="content-box 4xl:h-136">
                        <Tournaments data={tournamentsData} />
                    </div>

                    <div className="content-box 4xl:h-136">
                        <Social />
                    </div>
                </div>
                <AdvertisementDisplay type="leaderboard-small" className="mb-4">
                    <DesktopDynamicTop />
                </AdvertisementDisplay>
                <div className="content-box 4xl:h-212 mb-4">
                    <Leaderboards />
                </div>
                <AdvertisementDisplay type="leaderboard-small" className="mb-4">
                    <DesktopDynamicFooter />
                </AdvertisementDisplay>
            </div>
        </Base>
    );
}

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    const getLocale = ConfigService.getServerSideOption('locale', req.headers.cookie || '');

    const getTournaments = async () => {
        const response = await axios.get(`${Config.apiUrl}/tournaments/list?locale=${getLocale}&limit=3`).catch((e) => console.log(e))
        if (response && response.data) return response.data?.data || [];
        else return [];
    };

    const getNews = async () => {
        const response = await axios.get(`${Config.apiUrl}/newsletter/list?limit=2`).catch((e) => console.log(e))
        if (response && response.data) return response.data?.data || [];
        else return [];
    };

    const getPlayerChallenges = async () => {
        const response = await axios.get(`${Config.apiUrl}/player/challenges`, { 
            withCredentials: true,
            headers: { cookie: req.headers.cookie }
        }).catch((e) => console.log(e))
        if (response && !response.data.error) return (response.data || []).splice(0, 2);
        else return [];
    };

    return {
        
        props: {
            ...(await serverSideTranslations(getLocale)),
            newsData: await getNews() || [], 
            tournamentsData: await getTournaments() || [], 
            challengesData: await getPlayerChallenges() || [], 
            mode: params?.mode || '',
            loaded: true
        },
    };
}

export default Play;