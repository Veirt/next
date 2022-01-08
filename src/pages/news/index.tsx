import axios from 'axios';
import { useTranslation } from 'next-i18next';
import NewsItem from '../../components/News/NewsItem';
import Config from '../../Config';
import DesktopDynamicFooter from "../../components/Advertisement/DesktopDynamicFooter";
import DesktopTop from "../../components/Advertisement/DesktopTop";
import {NewsletterData} from "../../types.client.mongo";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfigService from '../../services/ConfigService';
import { Meta } from '../../layout/Meta';
import Base from '../../templates/Base';
import { GetServerSidePropsContext } from 'next';

interface IProps {
    newsData: NewsletterData[];
}

const News = ({ newsData }: IProps) => {
   
    const { t } = useTranslation();
    const getLatestNewsId = typeof localStorage !== 'undefined' ? parseInt((localStorage.getItem('latestNewsId') || ''), 10) || 0 : 0;

    return (
        <Base meta={<Meta title={t('page.queue.titles.latestNews')} />} ads={{ enableBottomRail: true }}>
            <div className="container container-margin py-10">
                <DesktopTop />
                <div>
                    <h1 className="mb-6 h1 uppercase text-white">
                        {t('page.queue.titles.latestNews')}
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <div className={"col-span-full sm:col-span-full xl:col-span-2"}>
                            {newsData.map((row, index) => index === 0 && <NewsItem className={"pt-16"} isBig key={row.slug} {...row} showUnread={row.increment > getLatestNewsId} /> )}
                        </div>
                        <div className={"col-span-full sm:col-span-1"}>
                            {newsData.map((row, index) => index === 1 && <NewsItem className={"pt-16"} isBig key={row.slug} {...row} showUnread={row.increment > getLatestNewsId} /> )}
                        </div>
                        <div className={"col-span-1 sm:col-span-1"}>
                            {newsData.map((row, index) => index === 2 && <NewsItem className={"pt-16"} isBig key={row.slug} {...row} showUnread={row.increment > getLatestNewsId} /> )}
                        </div>
                    </div>
                </div>
                <div className={"mt-12"}>
                    <h2 className="mb-6 h2 uppercase text-white">
                        {t('page.queue.titles.archiveNews')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {newsData.map((row, index) => index >= 3 && index <= 18 && <NewsItem isBig key={row.slug} {...row} showUnread={row.increment > getLatestNewsId} /> )}
                    </div>
                </div>
                <DesktopDynamicFooter />
            </div>
        </Base>
    );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const getNews = async () => {
      const response = await axios.get(`${Config.apiUrl}/newsletter/list?limit=50`).catch((e) => console.log(e));
      if (response && response.data) return response.data.data;
      else return [];
  };

  return {
      props: {
          ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
          newsData: await getNews(),
      }
  }
}

export default News;
