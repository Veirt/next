import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Meta } from '../../layout/Meta';
import ConfigService from '../../services/ConfigService';
import Base from '../../templates/Base';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const Index = () => {
  const timerRef = useRef<NodeJS.Timer | null>(null);

  const initiateToasts = () => {
    toast.success('This is a success toast!');
    toast.error('This is an error toast!');
    toast.warn('This is a warn toast!');
    toast.info('This is an info toast!');
    toast.dark('This is a dark toast! This is a dark toast! This is a dark toast! This is a dark toast!');
  };

  useEffect(() => {
    initiateToasts();

    if (!timerRef.current) timerRef.current = setInterval(() => initiateToasts(), 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Base meta={<Meta title={'Playground'} />} isLoaded={true}>
        <div className={'flex h-screen'}></div>
      </Base>
    </>
  );
};

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
    },
  };
}

export default Index;
