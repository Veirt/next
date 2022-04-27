import { NewsletterData } from '../../types.client.mongo';
import { useTranslation } from 'next-i18next';
import NewsItem from '../News/NewsItem';

interface IProps {
  data: NewsletterData[];
}

const News = (props: IProps) => {
  const { data } = props;

  const { t } = useTranslation();

  return data && data.length !== 0 ? (
    <div>
      <div className="h1 pb-6">{t('component.navbar.news')}</div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {data.map((item) => (
          <div key={item.slug}>
            <NewsItem {...item} isBig />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default News;
