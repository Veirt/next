import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import Challenges from "../../components/Play/Challenges";
import Leaderboards from "../../components/Play/Leaderboards";
import Queue from "../../components/Play/Queue";
import Config from "../../Config";
import { Meta } from "../../layout/Meta";
import ConfigService from "../../services/ConfigService";
import Base from "../../templates/Base";
import { TournamentData } from "../../types.client.mongo";

interface IProps {
    mode: string;
    laddersData: TournamentData[];
}

const Play = (props: IProps) => {
    const { mode, laddersData } = props;

    return (
        <Base meta={<Meta title="Joining Match" />} ads={{ enableBottomRail: true }} isLoaded={true}>
            <div className="container container-margin container-padding">
                <Queue mode={mode}/>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div>
                        <div className="content-box h-108">
                            <Challenges />
                        </div>
                    </div>
                    <div className="xl:col-span-2">
                        <div className="content-box h-auto">
                            <Leaderboards />
                        </div>
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

    return {
        props: {
            ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
            laddersData: await getTournaments(),
            mode: params?.mode || '',
        },
    };
}

export default Play;