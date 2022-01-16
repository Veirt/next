import {FormEvent, useEffect, useState, useCallback, useRef} from 'react';
import { useTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import Config from '../../Config';
import TournamentItem from '../../components/Tournament/TournamentItem';
import {faCaretDown, faFilter, faGlobe, faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TournamentData} from "../../types.client.mongo";
import Pagination from "../../components/Uncategorized/Pagination";
import Base from '../../templates/Base';
import { Meta } from '../../layout/Meta';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfigService from '../../services/ConfigService';
import { GetServerSidePropsContext } from 'next';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';

interface ILocales {
  key: string;
  name: string;
}

interface ITypes {
  id: number;
  name: string;
}

export interface TournamentDataProps {
  total: number;
  isNextPage: boolean;
  data: TournamentData[];
}

const Tournaments = () => {

    const { t } = useTranslation();
    const axiosCancelSource = useRef<CancelTokenSource | null>();

    const [ tournamentsData, setTournamentsData ] = useState<TournamentDataProps | null>(null);
    const [ search, setSearch ] = useState('');
    const [ limit ] = useState(20);
    const [ startNum, setStartNum ] = useState(0);
    const [ filterLocale, setFilterLocale ] = useState('en');
    const [ filterType, setFilterType ] = useState(0);
    const [ dropdown, setDropdown ] = useState<number>(0);
    const [ loaded, setLoaded ] = useState(false);

    const getTournaments = useCallback(async (searchString?: string) => {
      axios.get(`${Config.apiUrl}/tournaments/list?filter=${filterType}&locale=${filterLocale}&limit=${limit}&startNum=${startNum}${searchString ? `&search=${searchString}` : ''}`, {
        cancelToken: axiosCancelSource.current?.token,
      }).then(response => {
          setTournamentsData(response.data);
          setLoaded(true);
      }).catch(e => console.log(e));
    }, [filterType, filterLocale, limit, startNum]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await getTournaments(search);
    }

    useEffect(() => {
      axiosCancelSource.current = axios.CancelToken.source();
      getTournaments().then();
      return () => axiosCancelSource.current?.cancel();
    }, [getTournaments]);

    const locales: ILocales[] = [
        { key: 'en', name: 'English', },
        { key: 'fr-FR', name: 'French', },
        { key: 'es-MX', name: 'Spanish (Mexico)', },
        { key: 'de-DE', name: 'German', },
    ];

    const types: ITypes[] = [
        { id: 0, name: "Ladders" },
        { id: 1, name: "Tournaments" }
    ]

    return (
        <Base meta={<Meta title={t('page.tournaments.title')} />} ads={{ enableBottomRail: true }} isLoaded={(loaded && tournamentsData !== null)}>
            <div className="container container-margin container-content">
                <AdvertisementDisplay className="mb-6">
                    
                </AdvertisementDisplay>
                <div className="content-box">
                    <h1 className={"text-white uppercase"}>{t('page.tournaments.title')}</h1>
                    <div className={"flex flex-wrap mt-5"}>
                        <div className={"w-full lg:w-auto mr-auto my-auto"}>
                            <div className={"flex flex-wrap gap-x-2 text-lg text-white uppercase"}>

                                <div className={"relative"}>
                                    <button type={"button"} className={"w-44 button-dropdown border-transparent bg-gray-700 hover:bg-gray-750"} onClick={() => setDropdown(dropdown === 1 ? 0 : 1)}>
                                        <FontAwesomeIcon icon={faFilter} className={"mr-1"} />
                                        {types[filterType]?.name}
                                        <div className={"absolute right-0 top-0 mt-1.5 mr-3"}>
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        </div>
                                    </button>
                                    <div className={`dropdown w-40 ${dropdown === 1 ? 'is-active' : 'is-not'}`}>
                                        {types.map((item) => <button key={`filterType_${item.id}`} type={"button"} className={`item ${filterType === item.id ? 'is-active' : ''}`} onClick={() => { setFilterType(item.id); setDropdown(0); }}>{item.name}</button>)}
                                    </div>
                                </div>

                                <div className={"relative"}>
                                    <button type={"button"} className={"w-48 button-dropdown border-transparent bg-gray-700 hover:bg-gray-750"} onClick={() => setDropdown(dropdown === 2 ? 0 : 2)}>
                                        <FontAwesomeIcon icon={faGlobe} className={"mr-1"} />
                                        {locales.map(item => item.key === filterLocale ? item.name : '')}
                                        <div className={"absolute right-0 top-0 mt-1.5 mr-3"}>
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        </div>
                                    </button>
                                    <div className={`dropdown w-44 ${dropdown === 2 ? 'is-active' : 'is-not'}`}>
                                        {locales.map((item) => <button key={`filterType_${item.key}`} type={"button"} className={`item ${filterLocale === item.key ? 'is-active' : ''}`} onClick={() => { setFilterLocale(item.key); setDropdown(0); }}>{item.name}</button>)}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className={"w-full lg:w-auto"}>
                            <form method={"post"} onSubmit={handleSubmit}>
                                <div className={"flex"}>
                                    <input type={"text"} name="search" value={search} className={"form-settings form-settings-small w-auto"} style={{ borderTopRightRadius: '0', borderBottomRightRadius: '0' }} onChange={(e) => setSearch(e.target.value)} />
                                    <button type={"submit"} className={"bg-gray-700 hover:bg-gray-600 focus:outline-none transition ease-in-out duration-200 w-16 text-white rounded-r"}><FontAwesomeIcon icon={faSearch} /></button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className={"mt-6"}>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {tournamentsData?.data.length 
                                ? tournamentsData.data.map(tournament => <TournamentItem key={tournament.tournamentId} {...tournament} />)
                                : <div className={"col-span-full py-48 text-white font-semibold text-center bg-gray-700"}>No results found!</div>
                            }

                            <div className={"col-span-full flex justify-end"}>
                                <Pagination isNextPage={(tournamentsData && tournamentsData.isNextPage) ? true : false} skip={startNum} nextPage={() => setStartNum(startNum + limit)} prevPage={() => setStartNum(startNum - limit)} />
                            </div>
                        </div>
                    </div>
                </div>

                <AdvertisementDisplay className="mt-6">
                        
                </AdvertisementDisplay>
            </div>
        </Base>
    );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  return {
      props: {
          ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
      }
  }
}

export default Tournaments;
