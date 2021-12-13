import {FC} from 'react';
import {PlayerExtendedData, PlayerMatchData} from "../../types.client.mongo";
import PlayerCard from "../Player/PlayerCard";
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormatIndex from '../Uncategorized/FormatIndex';

export interface PlayerMatchExtendedData extends PlayerMatchData {
    player: PlayerExtendedData[];
    prizing: {
        currency: number;
    }
}

interface IProps {
    data: PlayerMatchExtendedData[];
    skip: number;
}


const LeaderboardPlayerPoints:FC<IProps> = (props) => {
    const { data, skip } = props;

    return (
        <div>
            <div className="flex leaderboards--head">
                <div className="hidden md:block w-14 text-center font-bold">#</div>
                <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">Name</div>
                <div className="hidden md:block w-32">Prizing</div>
                <div className="hidden md:block w-32">Points</div>
                <div className={"w-8 md:hidden"} />
            </div>

            {data.map((item, key) => (
                <div key={(item.player && item.player[0]) ? item.player[0].playerId : key} className="flex leaderboards--row">
                    <div className="hidden md:block w-10 text-center font-bold my-auto"><FormatIndex index={(key + skip + 1)} /></div>
                    <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">
                        {(item.player && item.player[0]) ? <PlayerCard {...item.player[0]} useTransparent isLeaderboard /> : <div className={"py-7"} />}
                    </div>
                    <div className="hidden md:block w-32 my-auto">
                        {(item.prizing && item.prizing.currency) 
                          ? (
                              <>
                                  <FontAwesomeIcon icon={faCoins} className={"text-yellow-400 text-base mr-1"} /> 
                                  <span className={"text-white uppercase font-semibold"}>{item.prizing.currency.toLocaleString()}</span>
                              </> 
                          ) : ''}
                    </div>
                    <div className="w-32 my-auto">{Math.floor(item.points).toLocaleString()} pts</div>
                    <div className={"w-8 md:hidden"} />
                </div>
            ))}
        </div>
    )
}

export default LeaderboardPlayerPoints;