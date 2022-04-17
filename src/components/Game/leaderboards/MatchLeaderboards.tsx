import {FC, useState, useCallback, useRef, useEffect} from 'react';
import axios, { CancelTokenSource } from 'axios';
import Config from '../../../Config';
import LeaderboardPlayerMatch, {PlayerMatchExtendedData} from "../../../components/Leaderboard/LeaderboardPlayerMatch";
import useConfig from "../../../hooks/useConfig";
import {useTranslation} from "next-i18next";
import LoadingScreen from "../../../components/Uncategorized/LoadingScreen";
import Pagination from "../../../components/Uncategorized/Pagination";

export interface MatchLeaderboardsProps {
  textId: number;
}

const MatchLeaderboards: FC<MatchLeaderboardsProps> = (props) => {
  const axiosCancelSource = useRef<CancelTokenSource | null>(null);

  const { textId } = props;
  const { t } = useTranslation();

  const [ skip, setSkip ] = useState<number>(0);

  const [ leaderboardsData, setLeaderboardsData ] = useState<PlayerMatchExtendedData[]>([]);
  const [ leaderboardsNextPage, setLeaderboardsNextPage ] = useState<boolean>(false);
  const [ leaderboardsLoaded, setLeaderboardsLoaded ] = useState<boolean>(false);

  const getLeaderboards = useCallback(() => {
    axios.get(`${Config.apiUrl}/leaderboards/matches?flagId=0&textId=${textId}&startNum=${skip}&limit=30`, { withCredentials: true, cancelToken: axiosCancelSource.current?.token, })
        .then(response => {
          if (!response.data.error) {
            setLeaderboardsData(response.data.data);
            setLeaderboardsNextPage(response.data.isNextPage);
            setLeaderboardsLoaded(true);
          }
        }).catch(e => console.log(e));
  }, [ skip, textId ]);

  useEffect(() => {
    axiosCancelSource.current = axios.CancelToken.source();
    getLeaderboards();
    return () => axiosCancelSource.current?.cancel();
  }, [ getLeaderboards ]);

  return (
      <div className="content-box mt-6">
        <div className={"h2 mb-6"}>{t('page.match.highscores')}</div>
        {leaderboardsLoaded
            ? (
                <>
                    <LeaderboardPlayerMatch data={leaderboardsData} playerData={[]} skip={skip} />
                    <Pagination isNextPage={leaderboardsNextPage} skip={skip} nextPage={() => setSkip(skip + 30)} prevPage={() => setSkip(skip - 30)} />
                </>
            ) : <LoadingScreen isPartial />
        }
      </div>  
  );
}

export default MatchLeaderboards;
