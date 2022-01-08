import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
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
            <div className="flex h-screen">
                <div className="m-auto">
                    <div className="container">
                        <Queue mode={mode} tournamentData={laddersData} />
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