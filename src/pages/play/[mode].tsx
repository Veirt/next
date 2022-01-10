import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import AdvertisementDisplay from "../../components/Advertisement/AdvertisementDisplay";
import DesktopTop from "../../components/Advertisement/DesktopTop";
import SidebarSquare from "../../components/Advertisement/SidebarSquare";
import Challenges from "../../components/Play/Challenges";
import Leaderboards from "../../components/Play/Leaderboards";
import Queue from "../../components/Play/Queue";
import Tournaments from "../../components/Play/Tournaments";
import Config from "../../Config";
import { Meta } from "../../layout/Meta";
import ConfigService from "../../services/ConfigService";
import Base from "../../templates/Base";
import { PlayerChallengeData, TournamentData } from "../../types.client.mongo";

interface IProps {
    mode: string;
    tournamentsData: TournamentData[];
    challengesData: PlayerChallengeData[];
}

const Play = (props: IProps) => {
    const { mode, challengesData, tournamentsData } = props;

    return (
        <Base meta={<Meta title="Take your typing to the next level" />} ads={{ enableBottomRail: true }} isLoaded={true}>
            <div className="container container-margin container-content">
                <Queue mode={mode}/>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div>
                        <div className="content-box xl:h-108 mb-4">
                            <Challenges data={challengesData} />
                        </div>
                        <div className="content-box xl:h-108 mb-4">
                            <Tournaments data={tournamentsData} />
                        </div>
                        <AdvertisementDisplay type="square" className="mb-4">
                            <SidebarSquare />
                        </AdvertisementDisplay>
                    </div>
                    <div className="xl:col-span-2">
                        <AdvertisementDisplay type="leaderboard-small" className="mb-4">
                            <DesktopTop />
                        </AdvertisementDisplay>
                        <div className="content-box xl:h-220 mb-4">
                            <Leaderboards />
                        </div>
                        <AdvertisementDisplay type="leaderboard-small" className="mb-4">
                            <DesktopTop />
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
            tournamentsData: await getTournaments(),
            challengesData: await getPlayerChallenges() || [], 
            mode: params?.mode || '',
        },
    };
}

export default Play;