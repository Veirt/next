import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import AdvertisementDisplay from "../../components/Advertisement/AdvertisementDisplay";
import DesktopDynamicTop from "../../components/Advertisement/DesktopDynamicTop";
import DesktopTop from "../../components/Advertisement/DesktopTop";
import SidebarDynamicLong from "../../components/Advertisement/SidebarDynamicLong";
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
}

const Play = (props: IProps) => {
    const { mode, challengesData, tournamentsData } = props;

    return (
        <Base meta={<Meta title="Take your typing to the next level" />} ads={{ enableBottomRail: true }} isLoaded={true}>
            <div className="container container-margin container-content">
                <Queue mode={mode}/>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
                    {(challengesData && challengesData.length !== 0) ? (
                        <div className="content-box 4xl:h-124">
                            <Challenges data={challengesData} />
                        </div>
                    ) : (
                        <div className="content-box 4xl:h-124">
                            <Guest />
                        </div>
                    )}
                    
                    <div className="content-box 4xl:h-124">
                        <Tournaments data={tournamentsData} />
                    </div>

                    <div className="content-box 4xl:h-124">
                        <Social />
                    </div>
                </div>
                <AdvertisementDisplay type="leaderboard-small" className="mb-4">
                    <DesktopDynamicTop />
                </AdvertisementDisplay>
                <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-4">
                    <div className="lg:col-span-3 xl:col-span-2">
                        <div className="content-box 4xl:h-212 mb-4">
                            <Leaderboards />
                        </div>
                    </div>
                    <div className="col-span-full lg:col-span-2 xl:col-span-1">
                        <AdvertisementDisplay type="sidebar" className="mb-4">
                            <SidebarDynamicLong />
                        </AdvertisementDisplay>
                    </div>
                </div>
            </div>
        </Base>
    );
}

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    const getTournaments = async () => {
        const response = await axios.get(`${Config.apiUrl}/tournaments/list?locale=en&limit=3`).catch((e) => console.log(e))
        if (response) return response.data.data;
        else return [];
    };

    const getNews = async () => {
        const response = await axios.get(`${Config.apiUrl}/newsletter/list?limit=2`).catch((e) => console.log(e))
        if (response) return response.data.data;
        else return [];
    };

    const getPlayerChallenges = async () => {
        const response = await axios.get(`${Config.apiUrl}/player/challenges`, { 
            withCredentials: true,
            headers: { cookie: req.headers.cookie }
        }).catch((e) => console.log(e))
        if (response && !response.data.error) return response.data.splice(0, 2);
        else return [];
    };

    return {
        props: {
            ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
            newsData: await getNews() || [], 
            tournamentsData: await getTournaments() || [], 
            challengesData: await getPlayerChallenges() || [], 
            mode: params?.mode || '',
        },
    };
}

export default Play;