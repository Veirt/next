import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Meta } from '../../layout/Meta';
import ConfigService from '../../services/ConfigService';
import Base from '../../templates/Base';
import { GetServerSidePropsContext } from 'next';
import MatchTextContainer from '../../components/Game/MatchTextContainer';

const Index = () => {

  return (
      <>
          <Base meta={<Meta title={"Playground"} />} isLoaded={true}>
                <div className={"flex h-screen"}>
                    <div className={"m-auto max-w-screen-lg"}>
                        <MatchTextContainer 
                            quote={"This is a test sentence. This is another sentence. This is a test sentence. This is another sentence. This is a test sentence. This is another sentence. This is a test sentence. This is another sentence. This is a test sentence. This is another sentence. This is a test sentence. This is another sentence."}
                            disabled={false}
                            removeLimit={false}
                            sendKeystroke={() => false}
                            sendWord={() => false}
                            isSuddenDeath={false}
                        />
                    </div>
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

export default Index;
