import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import Queue from "../../components/Play/Queue";
import { Meta } from "../../layout/Meta";
import ConfigService from "../../services/ConfigService";
import Base from "../../templates/Base";

interface IProps {
    mode: string;
}

const Play = (props: IProps) => {
    const { mode } = props;

    if (mode)
        return (
            <Base meta={<Meta title="Joining Match" />} ads={{ enableBottomRail: true }} isLoaded={true}>
                <div className="container">
                    <Queue mode={mode} />
                </div>
            </Base>
        );
    else
        return <></>;
}

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
            mode: params?.mode || 'random',
        },
    };
}

export default Play;