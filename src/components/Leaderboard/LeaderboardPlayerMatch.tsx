import {FC} from 'react';
import {PlayerExtendedData, PlayerMatchData} from "../../types.client.mongo";
import PlayerCard from "../Player/PlayerCard";
import moment from "moment";
import useConfig from "../../hooks/useConfig";
import FormatIndex from '../Uncategorized/FormatIndex';

export interface PlayerMatchExtendedData extends PlayerMatchData {
    player: PlayerExtendedData[];
    placement: number;
    prizing: {
        currency: number;
    }
}

interface IProps {
    data: PlayerMatchExtendedData[];
    playerData: PlayerMatchExtendedData[];
    skip: number;
    disableTrophy?: boolean;
}


const LeaderboardPlayerMatch:FC<IProps> = (props) => {
    const { data, playerData, skip, disableTrophy } = props;
    const { useCPM } = useConfig();

    return (
        <div>
            <div className="flex leaderboards--head">
                <div className="hidden md:block w-14 text-center font-bold">#</div>
                <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">Name</div>
                <div className="hidden md:block w-24">Acc %</div>
                <div className="hidden md:block w-32">Speed</div>
                <div className="hidden md:block w-32">Time</div>
                <div className={"w-8 md:hidden"} />
            </div>

            {data.map((item, key) => (
                <div key={(item.player && item.player[0]) ? item.player[0].playerId : key} className="flex leaderboards--row">
                    <div className="hidden md:block w-10 text-center font-bold my-auto">{!disableTrophy ? <FormatIndex index={(key + skip + 1)} /> : (key + skip + 1).toLocaleString()}</div>
                    <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">
                        {(item.player && item.player[0]) ? <PlayerCard {...item.player[0]} useTransparent isLeaderboard /> : <div className={"py-7"} />}
                    </div>
                    <div className="hidden md:block w-24 my-auto">{item.accuracy}%</div>
                    <div className="w-32 my-auto">{useCPM === '1' ? `${((item?.wpm || 0) * 5).toFixed(2)} CPM` : `${(item?.wpm || 0).toFixed(2)} WPM`}</div>
                    <div className="hidden md:block w-32 my-auto">{moment.unix(item.created).fromNow()}</div>
                    <div className={"w-8 md:hidden"} />
                </div>
            ))}

            {playerData.map((item, key) => (
                <div key={'data' + String((item.player && item.player[0]) ? item.player[0].playerId : key)} className="flex leaderboards--row leaderboards--highlight">
                    <div className="hidden md:block w-10 text-center font-bold my-auto">{item?.placement || 0}</div>
                    <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">
                        {(item.player && item.player[0]) ? <PlayerCard {...item.player[0]} useTransparent isLeaderboard /> : <div className={"py-7"} />}
                    </div>
                    <div className="hidden md:block w-24 my-auto">{item.accuracy}%</div>
                    <div className="w-32 my-auto">{useCPM === '1' ? `${((item?.wpm || 0) * 5).toFixed(2)} CPM` : `${(item?.wpm || 0).toFixed(2)} WPM`}</div>
                    <div className="hidden md:block w-32 my-auto">{moment.unix(item.created).fromNow()}</div>
                    <div className={"w-8 md:hidden"} />
                </div>
            ))}
        </div>
    )
}

export default LeaderboardPlayerMatch;