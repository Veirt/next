import {FC} from 'react';
import {PlayerChallengeData} from "../../types.client.mongo";
import PlayerCard from "../Player/PlayerCard";
import FormatIndex from '../Uncategorized/FormatIndex';

interface IProps {
    data: PlayerChallengeData[];
    skip: number;
}

const LeaderboardPlayerChallenges:FC<IProps> = (props) => {
    const { data, skip } = props;

    return (
        <div>
            <div className="flex leaderboards--head">
                <div className="hidden md:block w-14 text-center font-bold">#</div>
                <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">Name</div>
                <div className="hidden md:block w-40">Challenges</div>
                <div className={"w-8 md:hidden"} />
            </div>

            {data.map((item, key) => (
                <div key={(item.player && item.player[0]) ? item.player[0].playerId : key} className="flex leaderboards--row">
                    <div className="hidden md:block w-10 text-center font-bold my-auto"><FormatIndex index={(key + skip + 1)} /></div>
                    <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">
                        {(item.player && item.player[0]) ? <PlayerCard {...item.player[0]} useTransparent isLeaderboard /> : <div className={"py-7"} />}
                    </div>
                    <div className="hidden md:block w-40 my-auto">{item.count.toLocaleString()} challenge{(item.count > 1 || item.count === 0) ? 's' : ''}</div>
                    <div className={"w-8 md:hidden"} />
                </div>
            ))}
        </div>
    )
}

export default LeaderboardPlayerChallenges;