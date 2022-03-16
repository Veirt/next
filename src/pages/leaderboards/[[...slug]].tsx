import {useState, useEffect, useCallback, useRef, useMemo, ChangeEvent} from 'react';
import axios, {CancelTokenSource} from "axios";
import Config from '../../Config';
import {SeasonData, TextData} from "../../types.client.mongo";
import { toast } from 'react-toastify';
import LeaderboardPlayerRanked, {PlayerRankedExtendedData} from "../../components/Leaderboard/LeaderboardPlayerRanked";
import LeaderboardPlayerStatistic, {PlayerStatisticExtendedData} from "../../components/Leaderboard/LeaderboardPlayerStatistic";
import {useTranslation} from "next-i18next";
import Pagination from "../../components/Uncategorized/Pagination";
import {faCaretDown, faFilter, faSearch, faSort} from "@fortawesome/free-solid-svg-icons";
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
import LeaderboardPlayerMatch, { PlayerMatchExtendedData } from '../../components/Leaderboard/LeaderboardPlayerMatch';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import ReactTooltip from 'react-tooltip';

interface IProps {
    type: string;
    filter: string;
}

const Leaderboards = (props: IProps) => {
    const { type, filter } = props;

    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    const searchTimer = useRef<NodeJS.Timeout | null>(null);
    const { world } = useConfig();
    const { t } = useTranslation();

    const [ seasons, setSeasons ] = useState<SeasonData[]>([]);
    const [ loaded, setLoaded ] = useState<boolean>(false);
    const [ data, setData ] = useState<PlayerStatisticExtendedData[] | PlayerRankedExtendedData[] | PlayerMatchExtendedData[]>([]);
    const [ dataPage, setDataPage ] = useState<boolean>(true);
    const [ skip, setSkip ] = useState<number>(0);
    const [ dropdown, setDropdown ] = useState<number>(0);
    const [ textData, setTextData ] = useState<TextData[]>([]);
    const [ filterText, setFilterText ] = useState<TextData | null>(null);

    const modeList = useMemo(() => { return ['ranked', 'casual', 'texts'] }, []);
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

    const getTexts = useCallback(() => {
        axios.get(`${Config.apiUrl}/leaderboards/matches?worldId=${world}&textId=${filter || 1}&flagId=0&startNum=${skip}&limit=50`, { cancelToken: axiosCancelSource.current?.token })
            .then((response) => {
                if (!response.data.error) {
                    setData([ ...response.data.data ]);
                    setDataPage(response.data.isNextPage);
                    setLoaded(true);
                } else
                    toast.error("Unable to pull data");
            })
    }, [ world, filter, skip ]);

    const getFilterText = useCallback(() => {
        axios.get(`${Config.apiUrl}/texts/get?textId=${filter || 1}`, { cancelToken: axiosCancelSource.current?.token })
            .then((response) => {
                if (!response.data.error) 
                    setFilterText(response.data);
                else
                    toast.error("Unable to pull data");
            })
    }, [ filter ]);

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
        getTextSearch('');
        return () => axiosCancelSource.current?.cancel();
    }, [ getSeasons ]);

    useEffect(() => {
        setLoaded(false);
        setDropdown(0);
    }, [ type, filter ]);

    useEffect(() => {
        if (type === "ranked")
            getRanked();
        if (type === "texts") {
            getTexts();
            getFilterText();
        } else if (type === "casual" && filter !== "challenges")
            getStatistics();
        else if (type === "casual" && filter === "challenges")
            getChallenges();
    }, [ getStatistics, getRanked, getChallenges, getFilterText, getTexts, filter, type ]);

    const getTextSearch = (v: string) => {
        axios.get(`${Config.apiUrl}/texts/list?search=${v}&limit=5`, { cancelToken: axiosCancelSource.current?.token })
            .then((response) => {
                if (!response.data.error)
                    setTextData(response.data);
                else
                    toast.error("Unable to pull seasons");
            })
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (searchTimer.current) {
            clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        searchTimer.current = setTimeout(() => getTextSearch(e.target.value), 500);
    }

    return (
        <Base meta={<Meta title={`${type.charAt(0).toUpperCase() + type.slice(1)} ${t('component.navbar.leaders')}`} />} ads={{ enableBottomRail: true }} isLoaded={(data && loaded)}>
            <ReactTooltip />
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
                        {type === 'texts' && <LeaderboardPlayerMatch data={data as PlayerMatchExtendedData[]} skip={skip} />}
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
                                        <Link key={item} to={`/leaderboards/${item}${item === 'ranked' ? `/${seasons.length - 1}` : ''}${item === 'texts' ? `/1` : ''}`} className={`item ${item === type && 'is-active'}`}>
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
                                    <button type={"button"} className={"w-full button-dropdown-alt border-transparent bg-gray-750 hover:bg-gray-775"} onClick={() => setDropdown(dropdown ? 0 : 2)}>
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

                            {type === 'texts' && (
                                <>
                                    <div className={"relative w-full"}>
                                        <button type={"button"} className={"w-full truncate button-dropdown-alt border-transparent bg-gray-750 hover:bg-gray-775"} onClick={() => setDropdown(dropdown ? 0 : 2)}>
                                            <FontAwesomeIcon icon={faSort} className={"mr-3"} />
                                            Results for Text #{filterText?.textId}
                                            <div className={"absolute right-0 top-0 mt-3 mr-6"}>
                                                <FontAwesomeIcon icon={faCaretDown} />
                                            </div>
                                        </button>
                                        <div className={`dropdown dropdown-gap-small overflow-hidden w-full ${(dropdown && dropdown === 2) ? 'is-active' : 'is-not'}`}>
                                            <div className="flex">
                                                <input type="text" onChange={handleSearch} placeholder="Search" className="block w-full bg-gray-800 p-1 px-2 focus:outline-none" />
                                                <button className="button small darkgray" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                                                    <FontAwesomeIcon icon={faSearch} />    
                                                </button>
                                            </div>
                                            {textData.map((item) => (
                                                <Link key={item.textId} to={`/leaderboards/texts/${item.textId}`} className={`item ${item.textId === parseInt(filter, 10) && 'is-active'}`}>
                                                    {item.textId}. {item.content.split(' ').map((item, index) => index <= 16 && `${item}${index !== 16 ? ' ' : ''}`)}{item.content.split(' ').length >= 16 ? '...' : ''}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="content-box relative">
                                        <div className="h4 text-orange-400 mb-2">Title</div>
                                        <p className="text-sm">{filterText?.source}</p>

                                        <div className="h4 text-orange-400 mb-2 mt-4">Author</div>
                                        <p className="text-sm">{filterText?.author}</p>

                                        <div className="h4 text-orange-400 mb-2 mt-4">Contributor</div>
                                        <p className="text-sm">{filterText?.contributor === "admin" ? "Keymash" : filterText?.contributor}</p>

                                        <div className="h4 text-orange-400 mb-2 mt-4 relative">
                                            Content
                                            <button type="button" data-tip="Copy Text to Clipboard" onClick={() => { toast.success("Copied to clipboard!"); navigator?.clipboard.writeText(filterText?.content || '') }} className="absolute bottom-0 right-0 text-xl font-semibold text-orange-400 hover:opacity-70 transition ease-in-out duration-300">
                                                <FontAwesomeIcon icon={faCopy} className="" />
                                            </button>
                                        </div>
                                        <p className="text-sm">{filterText?.content}</p>
                                    </div>
                                </>
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