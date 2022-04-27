import { FC } from 'react';
import { PlayerExtendedData, PlayerTournamentData } from '../../types.client.mongo';
import PlayerCard from '../Player/PlayerCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import useConfig from '../../hooks/useConfig';
import FormatIndex from '../Uncategorized/FormatIndex';

export interface PlayerTournamentExtendedData extends PlayerTournamentData {
  player: PlayerExtendedData[];
}

interface IProps {
  data: PlayerTournamentExtendedData[];
  qualifier: number;
  qualifierSort: string;
  qualifierCutoff: number;
  status: number;
  recentWPMCutoff: number;
  prizingJSON: any;
}

const LeaderboardPlayerTournament: FC<IProps> = (props) => {
  const { data, prizingJSON, recentWPMCutoff, qualifier, qualifierCutoff, qualifierSort, status } = props;
  const { useCPM } = useConfig();
  const isWPM = ['maxWPM', 'avgWPM'];

  const isQualified = [];
  const isNotQualified = [];

  const dataLength = data.length || 0;
  let i;

  for (i = 0; i < dataLength; i++) {
    const item = data[i];
    if (qualifierSort !== 'avgWPM' || (qualifierSort === 'avgWPM' && item && item.matchesTotal >= recentWPMCutoff))
      isQualified.push(data[i]);
    else if (qualifierSort === 'avgWPM' && item && item.matchesTotal < recentWPMCutoff) isNotQualified.push(data[i]);
  }

  return data.length >= 0 ? (
    <div>
      <div className="flex leaderboards--head">
        <div className="hidden md:block w-10 text-center font-bold">#</div>
        <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">Name</div>
        {prizingJSON && prizingJSON.length >= 1 && <div className="hidden md:block w-32">Prize</div>}
        <div className="hidden md:block w-28">{isWPM.includes(qualifierSort) ? 'Speed' : 'Matches'}</div>
        <div className={'w-8 md:hidden'} />
      </div>

      {isQualified.map((item, key) => (
        <div key={item?.player[0]?.playerId} className="flex leaderboards--row">
          <div
            className={`hidden md:block my-auto w-10 text-center font-bold py-3 ${
              qualifier === 1 &&
              (qualifierCutoff >= key + 1 ? 'bg-green-400 bg-opacity-30' : 'bg-yellow-400 bg-opacity-30')
            }`}
          >
            <FormatIndex index={key + 1} />
          </div>
          <div className="w-96 md:w-96 mr-auto">
            {item?.player[0] && <PlayerCard {...item.player[0]} useTransparent isLeaderboard />}
          </div>
          {prizingJSON && prizingJSON[key] && (
            <div className={`hidden md:block w-32 my-auto ${status === 2 ? 'opacity-100' : 'opacity-50'}`}>
              {prizingJSON[key].type === 'currency' ? (
                <FontAwesomeIcon icon={faCoins} className={'text-yellow-400 text-base'} />
              ) : (
                <span className={'text-white uppercase text-xs font-semibold'}>{prizingJSON[key].type}</span>
              )}
              <span className={'text-white uppercase text-base font-semibold pl-2'}>
                {prizingJSON[key].type === 'currency' ? prizingJSON[key].value.toLocaleString() : ''}
              </span>
            </div>
          )}
          <div className="hidden md:block w-28 my-auto">
            {isWPM.includes(qualifierSort)
              ? useCPM === '1'
                // @ts-ignore
                ? `${(item[qualifierSort] * 5).toFixed(2)} CPM`
                // @ts-ignore
                : `${item[qualifierSort].toFixed(2)} WPM`
              // @ts-ignore
              : `${(item[qualifierSort] ?? 0).toLocaleString()} matches`}
          </div>
          <div className={'w-8 md:hidden'} />
        </div>
      ))}

      {qualifierSort === 'avgWPM' &&
        isNotQualified.map((item) => (
          <div key={item?.player[0]?.playerId} className="flex leaderboards--row opacity-70">
            <div className={`hidden md:block my-auto w-10 text-center font-bold bg-yellow-400 bg-opacity-30 py-3`}>
              X
            </div>
            <div className="w-96 md:w-96 mr-auto">
              {item?.player[0] && <PlayerCard {...item.player[0]} useTransparent isLeaderboard />}
            </div>
            <div className={`hidden md:block w-32 my-auto ${status === 2 ? 'opacity-100' : 'opacity-50'}`} />
            {/* @ts-ignore */}
            <div className="hidden md:block w-32 my-auto">{item.matchesTotal.toLocaleString()} matches</div>
            <div className="hidden md:block w-28 my-auto">
              {useCPM === '1' ? `${((item?.avgWPM || 0) * 5).toFixed(2)} CPM` : `${(item?.avgWPM || 0).toFixed(2)} WPM`}
            </div>
            <div className={'w-8 md:hidden'} />
          </div>
        ))}
    </div>
  ) : (
    <></>
  );
};

export default LeaderboardPlayerTournament;
