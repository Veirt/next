import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Meta } from '../../layout/Meta';
import ConfigService from '../../services/ConfigService';
import Base from '../../templates/Base';

const Guest = () => {
    const { t } = useTranslation();
    
    return (
        <Base meta={<Meta title="Your account has been reset" />}>
            <div className="flex h-screen">
                <div className="m-auto w-5/6 sm:w-4/6 lg:w-3/6 xl:w-2/5">
                    <div className={"text-5xl font-bold text-white uppercase"}>{t('page.guest.title')}</div>
                    <div className={"text-xl text-white pt-6"}>
                        {t('page.guest.text')}
                    </div>
                </div>
            </div>
        </Base>
    );
}

export async function getStaticProps() {
  return {
    props: {
      ...(await serverSideTranslations(ConfigService.getLocale()))  
    }
  }
}

export default Guest;
