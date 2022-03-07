import {NewsletterData} from "../../types.client.mongo";
import Base from "../../templates/Base";
import { Meta } from "../../layout/Meta";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ConfigService from "../../services/ConfigService";

interface IProps {
  slug: string
  data: NewsletterData;
  newsData: NewsletterData[];
}

const News = ({ data }: IProps) => {
    return (
        <Base meta={<Meta title={"v3 Released"} description={''} isThumbnail reverseTitle />} ads={{ enableBottomRail: true }}>
            <div className="container">
                <div className="border-t border-gray-800" />
                <img className="w-full h-auto mb-8" src={`/news/behance_test.jpg`} alt={"v3 released"} />
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

export default News;