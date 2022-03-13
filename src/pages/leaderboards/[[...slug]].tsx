import {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import axios, {CancelTokenSource} from "axios";
import Config from '../../Config';
import {SeasonData} from "../../types.client.mongo";
import { toast } from 'react-toastify';
import LeaderboardPlayerRanked, {PlayerRankedExtendedData} from "../../components/Leaderboard/LeaderboardPlayerRanked";
import LeaderboardPlayerStatistic, {PlayerStatisticExtendedData} from "../../components/Leaderboard/LeaderboardPlayerStatistic";
import {useTranslation} from "next-i18next";
import Pagination from "../../components/Uncategorized/Pagination";
import {faCaretDown, faFilter, faSort} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useConfig from "../../hooks/useConfig";
import moment from "moment";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfigService from '../../services/ConfigService';
import { GetServerSidePropsContext } from 'next';
import Link from '../../components/Uncategorized/Link';
import { Meta } from '../../layout/Meta';
import Base from '../../templates/Base';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';
import AdvertisementUnit from '../../components/Advertisement/Units/AdvertisementUnit';

interface IProps {
    type: string;
    filter: string;
}

const Leaderboards = (props: IProps) => {
    const { type, filter } = props;

    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    const { world } = useConfig();
    const { t } = useTranslation();

    const [ seasons, setSeasons ] = useState<SeasonData[]>([]);
    const [ loaded, setLoaded ] = useState<boolean>(false);
    const [ data, setData ] = useState<PlayerStatisticExtendedData[] | PlayerRankedExtendedData[]>([]);
    const [ dataPage, setDataPage ] = useState<boolean>(true);
    const [ skip, setSkip ] = useState<number>(0);
    const [ dropdown, setDropdown ] = useState<number>(0);

    const modeList = useMemo(() => { return ['ranked', 'casual'] }, []);
    const filterCasualList = ['experience', 'playtime', 'challenges', 'highestWPM', 'matchesWon'];
    const filterItemToName = {'experience': 'Total Experience', 'playtime': 'Total Playtime', 'challenges': 'Most Challenges', 'highestWPM': 'Fastest Speed', 'matchesWon': 'Most Wins'};

    const getRanked = useCallback(() => {
        axios.get(`${Config.apiUrl}/leaderboards/ranked?modeId=1&seasonId=${filter}&startNum=${skip}&limit=50`, { cancelToken: axiosCancelSource.current?.token })
            .then((response) => {
                if (!response.data.error) {
                    setData([ ...response.data.data ]);
                    setDataPage(response.data.isNextPage);
                    setLoaded(true);
                } else
                    toast.error("Unable to pull data");
            })
    }, [ filter, skip ]);

    const getStatistics = useCallback(() => {
        axios.get(`${Config.apiUrl}/leaderboards/statistics?worldId=${world || 0}&modeId=1&filter=${filter}&startNum=${skip}&limit=50`, { cancelToken: axiosCancelSource.current?.token })
            .then((response) => {
                if (!response.data.error) {
                    setData([ ...response.data.data ]);
                    setDataPage(response.data.isNextPage);
                    setLoaded(true);
                } else
                    toast.error("Unable to pull data");
            })
    }, [ filter, skip, world ]);

    const getChallenges = useCallback(() => {
        axios.get(`${Config.apiUrl}/leaderboards/challenges?startNum=${skip}&limit=50`, { cancelToken: axiosCancelSource.current?.token })
            .then((response) => {
                if (!response.data.error) {
                    setData([ ...response.data.data ]);
                    setDataPage(response.data.isNextPage);
                    setLoaded(true);
                } else
                    toast.error("Unable to pull data");
            })
    }, [ skip ]);

    const getSeasons = useCallback(() => {
        axios.get(`${Config.gameUrl}/seasons`, { cancelToken: axiosCancelSource.current?.token })
            .then((response) => {
                if (!response.data.error)
                    setSeasons(response.data);
                else
                    toast.error("Unable to pull seasons");
            })
    }, []);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        getSeasons();
        return () => axiosCancelSource.current?.cancel();
    }, [ getSeasons ]);

    useEffect(() => {
        setLoaded(false);
        setDropdown(0);
    }, [ type, filter ]);

    useEffect(() => {
        if (type === "ranked")
            getRanked();
        else if (type === "casual" && filter !== "challenges")
            getStatistics();
        else if (type === "casual" && filter === "challenges")
            getChallenges();
    }, [ getStatistics, getRanked, getChallenges, filter, type ]);
    return (
        <Base meta={<Meta title={`${type.charAt(0).toUpperCase() + type.slice(1)} ${t('component.navbar.leaders')}`} />} ads={{ enableBottomRail: true }} isLoaded={(data && loaded)}>
            <div className="container container-margin container-content">
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="content-box col-span-full lg:col-span-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-full lg:col-span-1">
                                <h1 className={"text-white mb-6"}>{t('component.navbar.leaders')}</h1>
                            </div>
                            <div className="col-span-full lg:col-span-1 lg:text-right lg:mt-1">
                                {type === 'ranked' && seasons.map((item) => item.id === (filter ? parseInt(filter, 10) : (seasons.length - 1)) ? (
                                    <div className={"flex flex-wrap justify-end text-sm opacity-70 font-semibold"}>
                                        <div className={"w-full"}>
                                            {moment.unix(item.start).format("ll")} - {moment.unix(item.end).format("ll")}
                                        </div>
                                        <div className={"w-full"}>
                                            {(Date.now() / 1000) > item.end ? 'Ended' : 'Ends'} {moment.unix(item.end).fromNow()}
                                        </div>
                                    </div>
                                ) : '')}
                            </div>
                        </div>

                        {type === 'ranked' && <LeaderboardPlayerRanked data={data as PlayerRankedExtendedData[]} skip={skip} />}
                        {(type === 'casual' && filter !== 'challenges') && <LeaderboardPlayerStatistic data={data as PlayerStatisticExtendedData[]} fieldName={filter} skip={skip} />}
                        {(type === 'casual' && filter === 'challenges') && <LeaderboardPlayerStatistic data={data as PlayerStatisticExtendedData[]} fieldName={"count"} skip={skip} />}
                        {loaded && <Pagination isNextPage={dataPage} skip={skip} nextPage={() => setSkip(skip + 25)} prevPage={() => setSkip(skip - 25)} />}
                    </div>

                    <div className="col-span-full lg:col-span-1">
                        <div className={"grid grid cols-2 gap-4"}>
                            <div className="relative w-full">
                                <button type={"button"} className={"w-full button-dropdown-alt border-transparent bg-gray-750 hover:bg-gray-775"} onClick={() => setDropdown(dropdown === 1 ? 0 : 1)}>
                                    <FontAwesomeIcon icon={faFilter} className={"mr-3"} />
                                    {type.slice(0, 1).toUpperCase()}{type.slice(1, type.length)}
                                    <div className={"absolute right-0 top-0 mt-3 mr-6"}>
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </div>
                                </button>
                                <div className={`dropdown dropdown-gap-small w-full ${(dropdown && dropdown === 1) ? 'is-active' : 'is-not'}`}>
                                    {modeList.map((item) => (
                                        <Link key={item} to={`/leaderboards/${item}${item === 'ranked' ? `/${seasons.length - 1}` : ''}`} className={`item ${item === type && 'is-active'}`}>
                                            {item.slice(0, 1).toUpperCase()}{item.slice(1, item.length)}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {type === 'casual' && (
                                <div className={"relative w-full"}>
                                    <button type={"button"} className={"w-full button-dropdown-alt border-transparent bg-gray-750 hover:bg-gray-775"} onClick={() => setDropdown(dropdown === 2 ? 0 : 2)}>
                                        <FontAwesomeIcon icon={faSort} className={"mr-4"} />
                                        {/* @ts-ignore */}
                                        {filterItemToName[filter]}
                                        <div className={"absolute right-0 top-0 mt-3 mr-6"}>
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        </div>
                                    </button>
                                    <div className={`dropdown dropdown-gap-small w-full ${(dropdown && dropdown === 2) ? 'is-active' : 'is-not'}`}>
                                        {filterCasualList.map((item) => (
                                            <Link key={item} to={`/leaderboards/casual/${item}`} className={`item ${item === filter && 'is-active'}`}>
                                                {/* @ts-ignore */}
                                                {filterItemToName[item]}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {type === 'ranked' && (
                                <div className={"relative w-full"}>
                                    <button type={"button"} className={"w-full button-dropdown-alt border-transparent bg-gray-700 hover:bg-gray-725"} onClick={() => setDropdown(dropdown ? 0 : 2)}>
                                        <FontAwesomeIcon icon={faSort} className={"mr-3"} />
                                        {seasons.map((item) => item.id === parseInt(filter, 10) ? item.name : '')}
                                        <div className={"absolute right-0 top-0 mt-3 mr-6"}>
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        </div>
                                    </button>
                                    <div className={`dropdown dropdown-gap-small w-full ${(dropdown && dropdown === 2) ? 'is-active' : 'is-not'}`}>
                                        {seasons.map((item) => (
                                            <Link key={item.name} to={`/leaderboards/ranked/${item.id}`} className={`item ${item.id === (filter ? parseInt(filter, 10) : (seasons.length - 1)) && 'is-active'}`}>
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <AdvertisementDisplay className="mt-4" downSize>
                            <AdvertisementUnit type="responsive-square-one" />
                        </AdvertisementDisplay>

                        <AdvertisementDisplay className="mt-4" downSize>
                            <AdvertisementUnit type="responsive-square-two" />
                        </AdvertisementDisplay>
                    </div>

                    <AdvertisementDisplay className="col-span-full">
                        <AdvertisementUnit type="leaderboard-bottom" />
                    </AdvertisementDisplay>
                </div>
            </div>
        </Base>
    )
}

export async function getServerSideProps({ req, query }: GetServerSidePropsContext) {
  return {
      props: {
          type: query.slug?.[0] || 'casual',
          filter: query.slug?.[1] || 'experience',
          ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
      }
  }
}

export default Leaderboards;