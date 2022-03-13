import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Meta } from '../../layout/Meta';
import ConfigService from '../../services/ConfigService';
import Base from '../../templates/Base';

const ErrorNotFound = () => {
    const { t } = useTranslation();

    return (
      <Base meta={<Meta title="Error Not Found" />}>
        <div className="flex h-screen">
          <div className="m-auto w-5/6 sm:w-4/6 lg:w-3/6 xl:w-2/5">
            <div className={"text-5xl font-bold text-white uppercase"}>{t('page.error404.title')}</div>
            <div className={"text-xl text-white pt-6"}>
                <div>{t('page.error404.message')}</div>
                <a className="text-orange-400 pb-1 border-b-2 border-transparent hover:border-orange-400 transition ease-in-out duration-300" href="mailto:support@keymash.io" target="_blank" rel="noopener noreferrer">
                    support@keymash.io
                </a>
            </div>
          </div>
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

export default ErrorNotFound;
