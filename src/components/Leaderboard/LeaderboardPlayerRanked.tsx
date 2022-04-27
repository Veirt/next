import { FC } from 'react';
import { PlayerExtendedData, PlayerRankedData } from '../../types.client.mongo';
import PlayerCard from '../Player/PlayerCard';
import FormatIndex from '../Uncategorized/FormatIndex';

export interface PlayerRankedExtendedData extends PlayerRankedData {
  player: PlayerExtendedData[];
  placement: number;
  Rank: {
    Rank: string;
    Games: number;
    Remaining: number;
    SR: number;
  };
}

interface IProps {
  data: PlayerRankedExtendedData[];
  playerData: PlayerRankedExtendedData[];
  skip: number;
}

const LeaderboardPlayerRanked: FC<IProps> = (props) => {
  const { data, playerData, skip } = props;

  return (
    <div>
      <div className="flex leaderboards--head">
        <div className="hidden md:block w-10 text-center font-bold">#</div>
        <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">Name</div>
        <div className="w-10" />
        <div className="w-32">Rank</div>
        <div className="hidden md:block w-16 text-center">W</div>
        <div className="hidden md:block w-16 text-center">T</div>
        <div className={'w-8 md:hidden'} />
      </div>

      {data.map(
        (item, key) =>
          item.Rank &&
          item.rating && (
            <div
              key={`${key + skip}${item.rating}${item.player[0] ? item.player[0].playerId : ''}`}
              className="flex leaderboards--row"
            >
              <div className="hidden md:block my-auto w-10 text-center font-bold">
                <FormatIndex index={item?.placement || 0} />
              </div>
              <div className="w-96 md:w-96 mr-auto">
                {item.player[0] ? <PlayerCard {...item.player[0]} useTransparent isLeaderboard /> : ''}
              </div>
              <div className={'w-12 lg:w-10 my-auto'}>
                <img
                  className={'w-7'}
                  src={`/ranks/${item.Rank ? `${item.Rank.Rank.replaceAll(' ', '').toLowerCase()}` : 'unrated'}.svg`}
                  alt={'Unrated'}
                />
              </div>
              <div className={'hidden md:block w-32 my-auto font-semibold'}>
                {item.Rank.Rank}
                <div className="opacity-50 text-xs -mt-1">{item.rating} SR</div>
              </div>
              <div className={'hidden md:block w-16 my-auto text-center font-semibold'}>
                {item.matchesWon.toLocaleString()}
              </div>
              <div className={'hidden md:block w-16 my-auto text-center font-semibold'}>
                {(item.matchesWon + item.matchesLost + item.matchesQuit).toLocaleString()}
              </div>
              <div className={'w-8 md:hidden'} />
            </div>
          ),
      )}

      {playerData.map(
        (item, key) =>
          item.Rank &&
          item.rating && (
            <div
              key={`data${key}${item.rating}${item.player[0] ? item.player[0].playerId : ''}`}
              className="flex leaderboards--row leaderboards--highlight"
            >
              <div className="hidden md:block my-auto w-10 text-center font-bold">{item.placement || 0}</div>
              <div className="w-96 md:w-96 mr-auto">
                {item.player[0] ? <PlayerCard {...item.player[0]} useTransparent isLeaderboard /> : ''}
              </div>
              <div className={'w-12 lg:w-10 my-auto'}>
                <img
                  className={'w-7'}
                  src={`/ranks/${item?.Rank ? `${item?.Rank?.Rank.replaceAll(' ', '').toLowerCase()}` : 'unrated'}.svg`}
                  alt={'Unrated'}
                />
              </div>
              <div className={'hidden md:block w-32 my-auto font-semibold'}>
                {item.Rank.Rank}
                <div className="opacity-50 text-xs -mt-1">{item.rating} SR</div>
              </div>
              <div className={'hidden md:block w-16 my-auto text-center font-semibold'}>
                {item.matchesWon.toLocaleString()}
              </div>
              <div className={'hidden md:block w-16 my-auto text-center font-semibold'}>
                {(item.matchesWon + item.matchesLost + item.matchesQuit).toLocaleString()}
              </div>
              <div className={'w-8 md:hidden'} />
            </div>
          ),
      )}
    </div>
  );
};

export default LeaderboardPlayerRanked;
