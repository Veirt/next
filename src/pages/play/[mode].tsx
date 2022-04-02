import { faBullhorn, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import AdvertisementDisplay from "../../components/Advertisement/AdvertisementDisplay";
import AdvertisementUnit from "../../components/Advertisement/Units/AdvertisementUnit";
import Challenges from "../../components/Play/Challenges";
import Guest from "../../components/Play/Guest";
import Leaderboards from "../../components/Play/Leaderboards";
import Queue from "../../components/Play/Queue";
import Social from "../../components/Play/Social";
import Tournaments from "../../components/Play/Tournaments";
import Config from "../../Config";
import { useGlobalContext } from "../../contexts/Global.context";
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
    const { announcement } = useGlobalContext();

    const [ latestAnnouncement, setLatestAnnouncement ] = useState<string>(typeof window !== 'undefined' ? (window.localStorage.getItem('announcement') || '') : '');

    const updateLatestAnnouncement = (v: string) => typeof window !== 'undefined' ? window.localStorage.setItem('announcement', v) : null;

    return (
        <Base meta={<Meta title="Take your typing to the next level" />} ads={{ enableBottomRail: true }} isLoaded={loaded}>

            <div className="container container-margin container-content">

                {(latestAnnouncement !== String(announcement.created) && announcement && announcement.value) && (
                    <div className="mb-4 bg-orange-400 px-1 py-1 rounded-xl shadow-xl flex relative">
                        <div className="hidden sm:block px-3 py-1 bg-orange-900 text-orange-200 font-semibold rounded-xl mr-2">
                            <FontAwesomeIcon icon={faBullhorn} className="mr-1" />
                            {announcement.value.split(': ')[0]}
                        </div>
                        <div className="pl-2 sm:pl-0 my-auto text-orange-900 font-semibold">
                            {announcement.value.split(': ')[1]}
                        </div>

                        <button type="button" className="absolute top-0.5 sm:top-1.5 right-4 text-xl text-orange-900 hover:opacity-70 transition ease-in-out duration-300">
                            <FontAwesomeIcon icon={faTimes} onClick={() => { setLatestAnnouncement(String(announcement.created)); updateLatestAnnouncement(String(announcement.created)); }} />
                        </button>
                    </div>
                )}
                
                <Queue mode={mode}/>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
                    <div className="col-span-2 content-box 3xl:h-128">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-4">
                            {(challengesData && challengesData.length !== 0) ? (
                                <div className="lg:pr-8">
                                    <Challenges data={challengesData} />
                                </div>
                            ) : (
                                <div className="lg:pr-8">
                                    <Guest />
                                </div>
                            )}

                            <div className="relative lg:pl-8">
                                <div className="hidden lg:block h-full border-r-4 rounded-full border-gray-800 absolute -left-2.5 z-20" />
                                <Tournaments data={tournamentsData} />
                            </div>
                        </div>
                    </div>

                    <div className="content-box 3xl:h-128 hidden lg:block">
                        <Social />
                    </div>
                </div>
                <AdvertisementDisplay type="leaderboard-small" className="mb-4">
                    <AdvertisementUnit type="leaderboard-top" />
                </AdvertisementDisplay>

                <div className="content-box 3xl:max-h-208 mb-4">
                    <Leaderboards />
                </div>

                <AdvertisementDisplay type="leaderboard-small" className="mb-4">
                    <AdvertisementUnit type="leaderboard-bottom" />
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