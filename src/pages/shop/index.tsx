import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import axios, { CancelTokenSource } from 'axios';
import Config from '../../Config';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import {usePlayerContext} from "../../contexts/Player.context";
import useCSRF from "../../hooks/useCSRF";
import ShopItem from "../../components/Shop/ShopItem";
import Redirect from '../../components/Uncategorized/Redirect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Meta } from '../../layout/Meta';
import ConfigService from '../../services/ConfigService';
import Base from '../../templates/Base';
import { GetServerSidePropsContext } from 'next';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';
import { useGlobalContext } from '../../contexts/Global.context';

const Shop = () => {
  const axiosCancelSource = useRef<CancelTokenSource | null>(null);

  const { sessionData } = usePlayerContext();
  const { playercards, borders, banners, nfts } = useGlobalContext();
  const { _csrf } = useCSRF();
  const { t } = useTranslation();

  const [redirect, setRedirect] = useState('');
  const [currency, setCurrency] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [owned, setOwned] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [tab, setTab] = useState('NFTs');
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
      name: 'NFTs',
      data: nfts,
      onClick: () => {
        setSubtab(0);
        setTab('NFTs');
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
      data: playercards,
      onClick: () => {
        setSubtab(1);
        setTab('page.shop.playercards');
      },
    },
    {
      name: 'page.shop.borders',
      data: borders,
      onClick: () => {
        setSubtab(0);
        setTab('page.shop.borders');
      },
    },
    {
      name: 'page.shop.banners',
      data: banners,
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

  const featuredItems = [ 'stars_red', "stars_purple", "stars_orange", "stars_green", "stars_blue", "lines_purple", "lines_red", "lines_orange", "lines_green", "lines_blue", "flowers_purple", "flowers_orange", "flowers_green", "flowers_blue", "diamonds", ];

  return (
      <>
          {redirect && <Redirect to={redirect} />}
          <Base meta={<Meta title={t('component.navbar.shop')} />} isLoaded={loaded}>
              <div className={'container container-margin'}>
                  <div className="content-box mb-4" style={{ padding: '1.25rem 2rem' }}>
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                          <div className="text-center lg:text-left -mt-1">
                              <h1>{t('component.navbar.shop')}</h1>
                          </div>
                          <div className="md:col-span-2 lg:col-span-3 text-center my-auto">
                              {tabs.map((item) => (
                                  <button key={item.name} type={"button"} onClick={item.onClick} className={`mb-2 md:mb-0 ${item.name === tab ? 'bg-gray-800 text-orange-400' : 'bg-gray-775 text-white'} hover:bg-gray-800 text-sm uppercase font-semibold px-6 py-1 rounded-xl h-8 my-auto mr-3 transition ease-in-out duration-300`}>
                                    {t(item.name)}
                                  </button>
                              ))}
                          </div>
                          <div className="text-center lg:text-right my-auto">
                              <div className={"text-xl font-semibold"}>
                                  <FontAwesomeIcon icon={faCoins} className={'text-yellow-400 mr-3'} />
                                  {currency.toLocaleString()}
                              </div>
                          </div>
                      </div>
                  </div>

                  {tabs.map(row => row.name === tab && row.subtabs && (
                      <div className={'bg-gray-750 flex flex-wrap justify-center mb-4 rounded-lg shadow'}>
                          {row.subtabs.map((item, index) => (
                              <button 
                                  key={item.name} 
                                  type={'button'} 
                                  onClick={() => setSubtab(item.order)}
                                  className={`${index === row.subtabs.length && 'rounded-r-lg'} ${subtab === item.order ? 'text-orange-400 bg-gray-775' : 'bg-gray-750 hover:bg-gray-775'} py-2.5 w-32 text-center text-sm font-semibold transition ease-in-out duration-300`}
                              >
                                  {item.name}
                              </button>
                          ))}
                      </div>
                  ))}

                  {tab === 'page.shop.featured' && (
                      <div>
                          <img className={"w-full h-80 object-center object-cover rounded-2xl shadow-lg"} src={'/assets/shop/featured.png'} alt={"Featured banner"} />
                          <AdvertisementDisplay className="mt-4">

                          </AdvertisementDisplay>
                          <div className={"content-box mt-4"}>
                              <h2>Newest Additions</h2>
                              <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6'}>
                                  {tabs.map(row => row.data && row.data.map((item) => (featuredItems.includes(item.file) && !item.secret) && (
                                      <ShopItem key={item.file} showType player={{ level: { Index: level, Next: 0, Prev: 0, Percentage: 0 }, inventory: owned, currency }} itemType={row.name} purchaseItem={purchaseItem} {...item} />
                                  )))}
                              </div>
                          </div>
                      </div>
                  )}
                  
                  {tab !== 'page.shop.featured' && (
                      <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-box'}>
                          {tabs.map(row => row.name === tab && row.data && row.data.map(item => !item.secret && (tab !== 'page.shop.playercards' || (tab === 'page.shop.playercards' && subtab === item.order)) && (
                              <ShopItem key={item.file} player={{ level: { Index: level, Next: 0, Prev: 0, Percentage: 0 }, inventory: owned, currency }} itemType={row.name} purchaseItem={purchaseItem} {...item} />
                          )))}
                      </div>
                  )}

                  <AdvertisementDisplay className="mt-4">
                  
                  </AdvertisementDisplay>
              </div>
          </Base>
      </>
  );
};

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  return {
      props: {
          ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
      }
  }
}

export default Shop;
