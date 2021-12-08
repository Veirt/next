import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ConfigService from "../../services/ConfigService";
import { useTranslation } from 'next-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import breaks from 'remark-breaks';
import NewsItem from '../../components/News/NewsItem';
import Config from '../../Config';
import ComboTop from "../../components/Advertisement/Combo/ComboTop";
import ComboBottom from "../../components/Advertisement/Combo/ComboBottom";
import {NewsletterData} from "../../types.client.mongo";
import moment from "moment";
import Base from "../../templates/Base";
import { Meta } from "../../layout/Meta";
import Link from "../../components/Uncategorized/Link";
import { useEffect } from "react";

interface IProps {
  slug: string
  data: NewsletterData;
  newsData: NewsletterData[];
}

const News = ({ slug, data, newsData }: IProps) => {

    const { t } = useTranslation();
    const getLatestNewsId = typeof localStorage !== 'undefined' ? parseInt((localStorage.getItem('latestNewsId') || ''), 10) || 0 : 0;

    useEffect(() => {
        localStorage.setItem('latestNewsId', String(data.increment));
    }, [data]);

    return (
        <Base meta={<Meta title={data.title} description={data.content.substr(0, 150) + '...'} customImage={`/news/${data.thumbnail}.jpg`} isThumbnail reverseTitle />} ads={{ enableBottomRail: true }}>
            <div className={"container container-margin py-10"}>
                <div className={"grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8"}>
                    <div className={"col-span-full md:col-span-2 xl:col-span-3"}>
                        {data && (
                            <div>
                                <ComboTop />
                                <div className="flex flex-wrap pb-4">
                                    <div className="w-full text-center lg:text-left lg:w-auto lg:mr-auto">
                                        <span className="text-gray-300 text-lg font-semibold uppercase">Posted {moment.unix(data.created).fromNow()}</span>
                                    </div>
                                    <div className="w-full text-center lg:text-right lg:w-auto my-auto">
                                        <Link to="/news" className="text-right block text-orange-400 hover:text-orange-300 focus:outline-none text-sm uppercase font-semibold">
                                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-1" /> {t('button.back')}
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-8 bg-gray-775 rounded-2xl shadow-lg">
                                    <div className="text-md text-orange-400 blogContent">
                                        <h1>{data.title}</h1>
                                        <div className={'text-white'}>
                                            <ReactMarkdown plugins={[breaks, gfm]}>{data.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                                <ComboBottom />
                            </div>
                        )}
                    </div>
                    <div className={"col-span-full md:col-span-1 xl:col-span-1"}>
                        <div className={"grid grid-cols-1 gap-y-4 mt-10 pt-0.5"}>
                            {newsData.map((row, index) => (index <= 5 && (index !== Number(slug)) && (row.slug !== String(slug))) && <NewsItem isBig key={row.slug} {...row} showUnread={row.increment > getLatestNewsId} /> )}
                        </div>
                    </div>
                </div>
            </div>
        </Base>
    );
}

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    const getNews = async (id?: string) => {
        const response = await axios.get(`${Config.apiUrl}/newsletter/list${id ? `?id=${id}` : '?limit=50'}`).catch((e) => console.log(e));
        if (response) return id ? response.data : response.data.data;
        else return null;
    };

    const getNewsletter = await getNews(String(params?.slug || ''));
    if (getNewsletter) {
        return {
            props: {
                ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
                newsData: await getNews(),
                data: getNewsletter,
                slug: params?.slug || ''
            }
        }
    } else 
        return { notFound: true };
}

export default News;