import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactElement, ReactNode } from 'react';
import Contribute from '../../components/About/Contribute';
import FrequentlyAskedQuestions from '../../components/About/FAQ';
import Privacy from '../../components/About/Privacy';
import TermsOfService from '../../components/About/TOS';
import Troubleshooting from '../../components/About/Troubleshooting';
import AboutUs from '../../components/About/Us';
import { Meta } from '../../layout/Meta';
import ConfigService from '../../services/ConfigService';
import Base from '../../templates/Base';

interface IProps {
  title: string;
  id: string;
}

const About = (props: IProps) => {
  const { title, id } = props;

  let useElement: ReactElement | ReactNode = <></>;

  switch (id || 'us') {
    case 'us':
      useElement = AboutUs;
      break;
    case 'troubleshooting':
      useElement = Troubleshooting;
      break;
    case 'contribute':
      useElement = Contribute;
      break;
    case 'tos':
      useElement = TermsOfService;
      break;
    case 'privacy':
      useElement = Privacy;
      break;
    case 'faq':
      useElement = FrequentlyAskedQuestions;
      break;
    default:
      useElement = AboutUs;
      break;
  }

  return (
    <Base meta={<Meta title={title} />} ads={{ enableBottomRail: true }}>
      {useElement}
    </Base>
  );
};

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  let useTitle: string;

  switch (params?.id || 'us') {
    case 'us':
      useTitle = 'About Us';
      break;
    case 'troubleshooting':
      useTitle = 'Troubleshooting';
      break;
    case 'contribute':
      useTitle = 'Contribute';
      break;
    case 'tos':
      useTitle = 'Terms of Service';
      break;
    case 'privacy':
      useTitle = 'Privacy Policy';
      break;
    case 'faq':
      useTitle = 'Frequently Asked Questions';
      break;
    default:
      useTitle = 'About Us';
      break;
  }

  return {
    props: {
      ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
      title: useTitle,
      id: params?.id || 'us',
    },
  };
}

export default About;
