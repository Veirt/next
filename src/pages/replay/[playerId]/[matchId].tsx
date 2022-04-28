import axios from 'axios';
import moment from 'moment';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AdvertisementDisplay from '../../../components/Advertisement/AdvertisementDisplay';
import AdvertisementUnit from '../../../components/Advertisement/Units/AdvertisementUnit';
import LeaderboardPlayerMatch, { PlayerMatchExtendedData } from '../../../components/Leaderboard/LeaderboardPlayerMatch';
import { PlayerMatchProfileExtendedData } from '../../../components/Leaderboard/LeaderboardPlayerProfile';
import PlayerCard from '../../../components/Player/PlayerCard';
import PipeReplay from '../../../components/Uncategorized/PipeReplay';
import Config from '../../../Config';
import useConfig from '../../../hooks/useConfig';
import { Meta } from '../../../layout/Meta';
import ConfigService from '../../../services/ConfigService';
import Base from '../../../templates/Base';

interface IProps {
  playerId: string;
  matchId: string;
  matchData: PlayerMatchProfileExtendedData;
  resultData: PlayerMatchExtendedData[];
}

const Replay = ({ matchData, resultData }: IProps) => {
  const { useCPM } = useConfig();
  const { t } = useTranslation();

  return (
    <Base meta={<Meta title={`${matchData?.wpm}WPM by ${matchData?.player?.[0]?.name}#${matchData?.player?.[0]?.discriminator}`} reverseTitle />} isLoaded={true} ads={{ enableBottomRail: true }}>
      <div className={'container container-margin container-content'}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="col-span-full lg:col-span-3">
            <PipeReplay {...matchData} onClose={() => false} />

            <div className="content-box mt-6">
              <div className={'h2 mb-6'}>{t('page.match.highscores')}</div>
              {resultData?.length !== 0 ? <LeaderboardPlayerMatch data={resultData || []} playerData={[]} skip={0} /> : <></>}
            </div>
          </div>
          <div>
            <PlayerCard className="px-4 py-2 rounded-lg shadow mb-4" {...matchData.player?.[0]!} />

            <div className="content-box mb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-825 py-4 rounded-xl text-center">
                  <div className="h4">{useCPM === '1' ? `${(matchData.wpm * 5).toFixed(2)}` : `${matchData.wpm.toFixed(2)}`}</div>
                  <div className="text-xs">{useCPM === '1' ? 'CPM' : 'WPM'}</div>
                </div>

                <div className="bg-gray-825 py-4 rounded-xl text-center">
                  <div className="h4">{matchData.accuracy}%</div>
                  <div className="text-xs">Accuracy</div>
                </div>

                <div className="bg-gray-825 py-4 rounded-xl text-center">
                  <div className="h4">{matchData.time}s</div>
                  <div className="text-xs">Time</div>
                </div>

                <div className="bg-gray-825 py-4 rounded-xl text-center">
                  <div className="h4">{matchData.exp}</div>
                  <div className="text-xs">EXP</div>
                </div>

                <div className="col-span-full bg-gray-825 py-4 rounded-xl text-center">
                  <div className="text-sm">Played {moment.unix(matchData.created).fromNow()}</div>
                </div>
              </div>
            </div>

            <AdvertisementDisplay>
              <AdvertisementUnit type="leaderboard-bottom" />
            </AdvertisementDisplay>
          </div>
        </div>
      </div>
    </Base>
  );
};

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const playerId = encodeURI(String(params?.playerId || ''));
  const matchId = String(params?.matchId || '');

  const matchData = await axios.get(`${Config.apiUrl}/player/matches?playerId=${playerId}&matchId=${matchId}`).catch((e) => console.log(e));

  if (playerId && matchId && matchData && !matchData.data.error) {
    const resultData = await axios.get(`${Config.apiUrl}/leaderboards/matches?textId=${matchData?.data?.leaderboardSort?.textId}`).catch((e) => console.log(e));

    return {
      props: {
        ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
        playerId,
        matchId,
        matchData: matchData?.data,
        resultData: resultData?.data?.data || [],
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}

export default Replay;
