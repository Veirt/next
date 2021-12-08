import ConfigService from "../../services/ConfigService";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import GameScreen from '../../components/Game/GameScreen';
import { GetServerSidePropsContext } from 'next';

interface IProps {
    textType?: string;
    embed?: boolean;
    embedClose?: () => void | false;
    embedOwner?: boolean;
}

const Game = (props: IProps) => <GameScreen {...props} />;

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  return {
      props: {
          ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
          textType: params?.type || 'random',
      }
  }
}

export default Game;
