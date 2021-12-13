import React, {useState, useEffect, useRef} from 'react';
import { useTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import Config from '../../../Config';
import ComboTop from "../../../components/Advertisement/Combo/ComboTop";
import SidebarSquare from "../../../components/Advertisement/SidebarSquare";
import SidebarDynamicLong from "../../../components/Advertisement/SidebarDynamicLong";
import DesktopDynamicFooter from "../../../components/Advertisement/DesktopDynamicFooter";
import {TournamentData} from "../../../types.client.mongo";
import {toast} from "react-toastify";
import moment from "moment";
import useCSRF from "../../../hooks/useCSRF";
import useConfig from "../../../hooks/useConfig";
import LeaderboardPlayerTournament, {PlayerTournamentExtendedData} from "../../../components/Leaderboard/LeaderboardPlayerTournament";
import {faClock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Redirect from '../../../components/Uncategorized/Redirect';
import ConfigService from '../../../services/ConfigService';
import Base from '../../../templates/Base';
import { Meta } from '../../../layout/Meta';
import { GetServerSidePropsContext } from 'next';

interface IProps {
    tournamentData: TournamentData;
    playersData: PlayerTournamentExtendedData[];
    tournamentId: string;
}

const TournamentView = ({ tournamentData, playersData, tournamentId }: IProps) => {

    const { _csrf } = useCSRF();
    const { world } = useConfig();
    const { t } = useTranslation();
    const axiosCancelSource = useRef<CancelTokenSource | null>();

    const [ redirect, setRedirect ] = useState('');

    const createTournamentMatch = () => {
        const postData = { _csrf, worldId: world, flagId: 1, modeId: 0, locale: 'en', tournamentId, };
        axios.post(`${Config.apiUrl}/match/search`, postData, { withCredentials: true, cancelToken: axiosCancelSource.current?.token })
            .then(response => {
                if (response && !response.data.error)
                    setRedirect('/game');
                else
                    toast.error(response.data.error || "We were unable to start finding a match!");
            }).catch(e => console.log(e));
    };

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        return () => axiosCancelSource.current?.cancel();
    }, [ ]);

    if (redirect) return <Redirect to={redirect} />;
    return (
        <Base meta={<Meta title={tournamentData?.name || ''} />} ads={{ enableBottomRail: true }} isLoaded={(tournamentData !== null)}>
            <div className="container container-margin py-10">
                <ComboTop />
                <div>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                        <div className="w-full text-center lg:w-auto lg:text-left my-auto">
                            <h1 className={"text-white uppercase"}>{tournamentData?.name}</h1>
                        </div>
                        <div className="w-auto text-center lg:ml-auto my-auto">
                            <div className={"py-3 uppercase rounded-lg font-bold bg-gray-700 text-gray-400 px-5"}>
                                <FontAwesomeIcon icon={faClock} className={"mr-1"} />
                                {tournamentData?.status === 0 && `${t('page.tournaments.starts')} ${moment.unix(tournamentData?.startTime).fromNow()}`}
                                {tournamentData?.status === 1 && `${t('page.tournaments.ends')} ${moment.unix(tournamentData?.endTime).fromNow()}`}
                                {tournamentData?.status === 2 && `${t('page.tournaments.finished')}`}
                            </div>
                        </div>
                        <div className="w-auto text-center my-auto">
                            {tournamentData?.bracket && (
                                <a href={tournamentData?.bracket} className="button large gray" target="_blank" rel="noopener noreferrer">
                                    {t('page.tournaments.bracket')}
                                </a>
                            )}
                        </div>
                        <div className="w-auto text-center my-auto">
                            {tournamentData?.status === 1 && (
                                <button type="button" onClick={() => createTournamentMatch()} className="button large orange">
                                    {t('page.tournaments.play')}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="relative flex flex-wrap mt-4">
                        <div className={`w-full lg:w-2/3 lg:pr-4`}>
                            {playersData?.length !== 0
                                ? <LeaderboardPlayerTournament data={playersData || []} status={tournamentData?.status || 0} recentWPMCutoff={tournamentData?.recentWPMTotal || 0} qualifier={tournamentData?.qualifier || 0} qualifierSort={tournamentData?.qualifierSort || 'maxWPM'} qualifierCutoff={tournamentData?.qualifierCutoff || 0} prizingJSON={tournamentData?.prizingJSON} />
                                : (
                                    <div className={"shadow-md bg-gray-750 rounded-lg font-semibold uppercase text-white py-32 text-center"}>
                                        {t('page.tournaments.none')}
                                    </div>
                                )
                            }
                            <DesktopDynamicFooter />
                        </div>
                        <div className="w-full lg:w-1/3">
                            <div className={"text-sm text-white"}>
                                {tournamentData?.qualifierSort === 'maxWPM' && (
                                    <div className={`mb-4 p-5 rounded-lg bg-gray-800 border-b-4 border-gray-750`}>
                                        <div className={"font-semibold"}>Highest WPM</div>
                                        <div>
                                            All players that have completed at least one match will appear showing their highest speed in a match.
                                        </div>
                                    </div>
                                )}
                                {tournamentData?.qualifierSort === 'avgWPM' && (
                                    <div className={`mb-4 p-4 bg-gray-800 border-b-4 border-gray-700`}>
                                        <div className={"font-semibold"}>Average WPM</div>
                                        <div>
                                            All players that have at least {tournamentData?.recentWPMTotal} matches will appear showing their Average speed based off their {tournamentData?.recentWPMTotal} most recent matches.

                                            <div className={"pt-4"}>
                                                <span className={"text-red-400 text-sm"}>Quitting matches will be included in your average as a "zero".</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {tournamentData?.qualifierSort === 'matchesTotal' && (
                                    <div className={`mb-4 p-4 bg-gray-800 border-b-4 border-gray-700`}>
                                        <div className={"font-semibold"}>Most Matches</div>
                                        <div>
                                            All players that have completed at least one match will appear showing their total matches.
                                        </div>
                                    </div>
                                )}
                            </div>
                            {tournamentData?.qualifier ? (
                                <div className="flex flex-wrap justify-center bg-gray-800 shadow-md py-2 mb-4">
                                    <div className="w-24">
                                        <div className="flex">
                                            <div className="w-4 my-auto">
                                                <div className="w-full h-4 bg-green-500 rounded-full" />
                                            </div>
                                            <div className="w-auto pl-1">
                                                <span className="text-xs uppercase text-white font-semibold">
                                                  {t('page.tournaments.qualified')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-32">
                                        <div className="flex">
                                            <div className="w-4 my-auto">
                                                <div className="w-full h-4 bg-yellow-500 rounded-full" />
                                            </div>
                                            <div className="w-auto pl-1">
                                                <span className="text-xs uppercase text-white font-semibold">
                                                  {t('page.tournaments.notqualified')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : <></>}

                            {tournamentData?.info && (
                                <div className={"panel mb-4"}>
                                    <div className={"head"}>{t('page.tournaments.info')}</div>
                                    <div className={"body"}>
                                        {tournamentData?.info.split('\n').map((item, key) => <span key={key}>{item}<br /></span>)}
                                    </div>
                                </div>
                            )}

                            <div className={"mb-4"}>
                                <SidebarSquare />
                            </div>

                            {tournamentData?.rules && (
                                <div className={"panel mb-4"}>
                                    <div className={"head"}>
                                        {t('page.tournaments.rules')}
                                    </div>
                                    <div className={"body"}>
                                        {tournamentData?.rules.split('\n').map((item, key) => <span key={key}>{item}<br /></span>)}
                                    </div>
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

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    const getTournamentData = async (tournamentId: string) => {
        const response = await axios.get(`${Config.apiUrl}/tournaments/list?id=${tournamentId || ''}`).catch((e) => console.log(e));
        if (response && !response.data.error) {
            response.data.prizingJSON = response.data.prizingJSON ? Object.values(JSON.parse(response.data.prizingJSON)) : [];
            return response.data;
        }
        return null;
    };

    const getTournamentPlayers = async (tournamentId: string) => {
        const response = await axios.get(`${Config.apiUrl}/tournaments/players?tournamentId=${tournamentId || ''}`).catch((e) => console.log(e));
        if (response && response.data) return response.data;
        return [];
    };

    const getTournament = await getTournamentData(String(params?.id || ''));
    if (getTournament) {
        return {
            props: {
                ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
                tournamentData: getTournament || null,
                playersData: await getTournamentPlayers(String(params?.id || '')),
                tournamentId: String(params?.id || ''),
            }
        }
    } 
    return { notFound: true };
}


export default TournamentView;