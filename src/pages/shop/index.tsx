import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import Config from '../../Config';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import ComboTop from "../../components/Advertisement/Combo/ComboTop";
import ComboBottom from "../../components/Advertisement/Combo/ComboBottom";
import {usePlayerContext} from "../../contexts/Player.context";
import useCSRF from "../../hooks/useCSRF";
import {ItemData, PlayerLevelData} from "../../types.client.mongo";
import ShopItem from "../../components/Shop/ShopItem";
import Redirect from '../../components/Uncategorized/Redirect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Meta } from '../../layout/Meta';
import ConfigService from '../../services/ConfigService';
import Base from '../../templates/Base';
import { GetServerSidePropsContext } from 'next';

interface IProps {
    gameData: {
        playercards: ItemData[];
        borders: ItemData[];
        banners: ItemData[];
    };
    playerData: {
        level: PlayerLevelData
        currency: number;
        owned: string[];
    };
}

const Shop = (props: IProps) => {
  const { gameData } = props;

  const axiosCancelSource = useRef<CancelTokenSource | null>(null);

  const { sessionData } = usePlayerContext();
  const { _csrf } = useCSRF();
  const { t } = useTranslation();

  const [redirect, setRedirect] = useState('');
  const [currency, setCurrency] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [owned, setOwned] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [tab, setTab] = useState('page.shop.featured');
  const [subtab, setSubtab] = useState(1);

  const tabs = [
    {
      name: 'page.shop.featured',
      onClick: () => {
        setSubtab(0);
        setTab('page.shop.featured');
      },
    },
    {
      name: 'page.shop.playercards',
      subtabs: [
        { order: 1, name: 'Patterns', },
        { order: 2, name: 'Pictures', },
        { order: 3, name: 'Space', },
        { order: 5, name: 'Games', },
        { order: 7, name: 'Systems', },
        { order: 10, name: 'Countries', },
      ],
      data: gameData.playercards,
      onClick: () => {
        setSubtab(1);
        setTab('page.shop.playercards');
      },
    },
    {
      name: 'page.shop.borders',
      data: gameData.borders,
      onClick: () => {
        setSubtab(0);
        setTab('page.shop.borders');
      },
    },
    {
      name: 'page.shop.banners',
      data: gameData.banners,
      onClick: () => {
        setSubtab(0);
        setTab('page.shop.banners');
      },
    },
  ];

  const getPlayerData = async () => {
      const response = await axios.get(`${Config.apiUrl}/shop/user`, { withCredentials: true });
      if (response && response.data) {
          setCurrency(response.data.currency);
          setLevel(response.data.level.Index);
          setOwned(response.data.inventory);
          setLoaded(true);
      }
  }

  const purchaseItem = (itemKey: string, itemPrice: number) => {
    axios
      .post(`${Config.apiUrl}/shop/purchase`, { _csrf, itemId: itemKey }, { withCredentials: true, cancelToken: axiosCancelSource.current?.token })
      .then(response => {
          if (response.data.error)
              toast.error(response.data.error);
          else {
              toast.success(response.data.message);

              setOwned(i => {
                const oldState = [...i];

                oldState.push(itemKey);
                return oldState;
              });
              setCurrency(i => i - itemPrice);
          }
      }).catch(e => console.log(e));
  };

  useEffect(() => {
    axiosCancelSource.current = axios.CancelToken.source();
    getPlayerData();

    /* Check if User is Guest */
    if (sessionData?.authName === 'Guest') setRedirect('/');
    return () => axiosCancelSource.current?.cancel();
  }, [ sessionData?.authName ]);

  const featuredItems = [ 'banner_chromatic_blue', 'banner_chromatic_green', 'banner_chromatic_orange', 'banner_chromatic_purple', 'banner_chromatic_red', 'space_earth', 'space_uranus', 'space_eclipse_2', 'space_jupiter', 'space_moon', 'space_neptune', 'space_saturn', 'space_mars', 'space_shutter', 'space_venus'];

  return (
      <>
          {redirect && <Redirect to={redirect} />}
          <Base meta={<Meta title={t('component.navbar.shop')} />} isLoaded={loaded}>
              <div className={'container container-margin py-10'}>
                  <div className={"flex flex-wrap gap-4"}>
                      <div className={"w-full lg:w-auto"}>
                          <h1 className={"text-white uppercase"}>{t('component.navbar.shop')}</h1>
                      </div>
                      {tabs.map((item) => (
                          <button key={item.name} type={"button"} onClick={item.onClick} className={`${item.name === tab ? 'bg-gray-750 text-orange-400' : 'bg-gray-775 text-white'} hover:bg-gray-750 text-sm  uppercase font-semibold px-6 py-1 rounded-xl shadow h-10 my-auto transition ease-in-out duration-300`}>
                            {t(item.name)}
                          </button>
                      ))}

                      <div className={"w-auto lg:ml-auto my-auto"}>
                          <div className={"text-white text-lg px-6 py-1.5 bg-gray-775 rounded-xl shadow font-semibold"}>
                              <FontAwesomeIcon icon={faCoins} className={'text-yellow-400 mr-3'} />
                              {currency.toLocaleString()}
                          </div>
                      </div>
                  </div>

                  {tabs.map(row => row.name === tab && row.subtabs && (
                      <div className={'flex flex-wrap mt-4 bg-black bg-opacity-20 rounded-l rounded-r shadow'}>
                          {row.subtabs.map((item, index) => (
                              <button key={item.name} type={'button'} onClick={() => setSubtab(item.order)}
                                  className={`${index === 0 && 'rounded-l'} ${index === row.subtabs.length && 'rounded-r'} ${subtab === item.order ? 'text-orange-400 border-orange-400' : 'text-white border-transparent'} py-2 w-32 text-center text-xs border-b-2 hover:text-gray-300 font-semibold uppercase transition ease-in-out duration-300`}
                              >
                                  {item.name}
                              </button>
                          ))}
                      </div>
                  ))}

                  <div className={'py-8'}>
                      <ComboTop />
                      {tab === 'page.shop.featured' && (
                          <div>
                              <img className={"w-full h-80 object-center object-cover rounded-2xl shadow-lg"} src={'/assets/shop/featured.png'} alt={"Featured banner"} />
                              <div className={"mt-10"}>
                                <h2 className={"py-2.5 bg-gray-775 shadow rounded-lg w-80 text-center text-2xl uppercase font-bold text-orange-400"}>
                                    Newest Additions
                                </h2>

                                <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-6 mt-6'}>
                                    {tabs.map(row => row.data && row.data.map((item) => (featuredItems.includes(item.file) && !item.secret) && (
                                        <ShopItem key={item.file} showType player={{ level: { Index: level, Next: 0, Prev: 0, Percentage: 0 }, inventory: owned, currency }} itemType={row.name} purchaseItem={purchaseItem} {...item} />
                                    )))}
                                </div>
                              </div>
                          </div>
                      )}
                      {tab !== 'page.shop.featured' && (
                          <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-6'}>
                              {tabs.map(row => row.name === tab && row.data && row.data.map(item => !item.secret && (tab !== 'page.shop.playercards' || (tab === 'page.shop.playercards' && subtab === item.order)) && (
                                  <ShopItem key={item.file} player={{ level: { Index: level, Next: 0, Prev: 0, Percentage: 0 }, inventory: owned, currency }} itemType={row.name} purchaseItem={purchaseItem} {...item} />
                              )))}
                          </div>
                      )}
                  </div>
                  <ComboBottom />
              </div>
          </Base>
      </>
  );
};

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const getData = async () => {
      const response = await axios.get(`${Config.gameUrl}/all`).catch((e) => console.log(e));
      if (response && response.data) return response.data;
      else return {};
  };

  return {
      props: {
          ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
          gameData: await getData(),
      }
  }
}

export default Shop;
