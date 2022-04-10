import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ConfigService from "../../services/ConfigService";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import breaks from 'remark-breaks';
import Config from '../../Config';
import {NewsletterData} from "../../types.client.mongo";
import moment from "moment";
import Base from "../../templates/Base";
import { Meta } from "../../layout/Meta";
import { useEffect } from "react";
import AdvertisementDisplay from "../../components/Advertisement/AdvertisementDisplay";
import AdvertisementUnit from "../../components/Advertisement/Units/AdvertisementUnit";

interface IProps {
  slug: string
  data: NewsletterData;
  newsData: NewsletterData[];
}

const News = ({ data }: IProps) => {

    useEffect(() => {
        localStorage.setItem('latestNewsId', String(data.increment));
    }, [data]);

    return (
        <Base meta={<Meta title={data.title} description={data.content.substr(0, 150) + '...'} customImage={`/news/${data.thumbnail}.jpg`} isThumbnail reverseTitle />} ads={{ enableBottomRail: true }} contentTopBorder>
            <div className="container">
                <div className={"container-smaller container-margin container-content"}>
                    <div className="py-14">
                        <h1 className="h1">{data.title}</h1>
                        <p className="pt-2 text-lg">
                            Published {moment.unix(data.created).fromNow()}
                        </p>
                    </div>

                    <div className="content-box blogContent">
                        <ReactMarkdown plugins={[breaks, gfm]}>{data.content}</ReactMarkdown>
                    </div>

                    <AdvertisementDisplay className="mt-6">
                        <AdvertisementUnit type={'leaderboard-bottom'} />
                    </AdvertisementDisplay>
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