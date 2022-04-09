import {FC} from 'react';
import {PlayerExtendedData, PlayerStatisticData} from "../../types.client.mongo";
import PlayerCard from "../Player/PlayerCard";
import useConfig from "../../hooks/useConfig";
import FormatIndex from '../Uncategorized/FormatIndex';

export interface PlayerStatisticExtendedData extends PlayerStatisticData {
    player: PlayerExtendedData[];
    placement: number;
}

interface IProps {
    data: PlayerStatisticExtendedData[];
    playerData: PlayerStatisticExtendedData[];
    fieldName: string;
    skip: number
}

const LeaderboardPlayerStatistic:FC<IProps> = (props) => {
    const { data, fieldName, skip, playerData } = props;
    const { useCPM } = useConfig();

    const updateValue = (fieldName: string, value: number) => {
        if (fieldName === "experience")
            return (value / 1000).toFixed(1) + 'K EXP';
        else if (fieldName === "playtime")
            return ((value / 60) / 60).toFixed(1) + ' hours';
        else if (fieldName === "highestWPM")
            return value ? (useCPM === '1' ? `${(value * 5).toFixed(2)} CPM` : `${value.toFixed(2)} WPM`) : '';
        else if (fieldName === "matchesWon")
            return (value || 0).toLocaleString() + ' wins';
        else if (fieldName === "count") // Challenges
            return (value || 0).toLocaleString() + ' challenges';
        else if (fieldName === "cr") // Challenges
            return <>{(value || 0).toLocaleString()} <span className="bg-gray-600 px-1 py-0 rounded-full">CR</span></>;
        else
            return value;
    }

    const updateColumn = (fieldName: string) => {
        if (fieldName === "experience")
            return "EXP";
        else if (fieldName === "playtime")
            return "Time";
        else if (fieldName === "highestWPM")
            return "WPM";
        else if (fieldName === "matchesWon")
            return "Wins";
        else if (fieldName === "count") // Challenges
            return "Challenges";
        else if (fieldName === "cr")
            return "Score";
        else
            return fieldName;
    }

    return (
        <div>
            <div className="flex leaderboards--head">
                <div className="hidden md:block w-10 text-center font-bold">#</div>
                <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">Name</div>
                <div className="w-32">{updateColumn(fieldName)}</div>
                <div className={"w-4 md:hidden"} />
            </div>

            {data.map((item, key) => (
                <div key={`${key + skip}${item.player[0]?.playerId}`} className="flex leaderboards--row">
                    <div className="hidden md:block my-auto w-10 text-center font-bold"><FormatIndex index={(key + skip + 1)} /></div>
                    <div className="w-96 md:w-96 mr-auto">
                        {item.player[0] && <PlayerCard {...item.player[0]} useTransparent isLeaderboard />}
                    </div>
                    {/* @ts-ignore */}
                    <div className="w-32 my-auto">{updateValue(fieldName, item[fieldName])}</div>
                    <div className={"w-8 md:hidden"} />
                </div>
            ))}

            {playerData.map((item) => (
                <div key={`data${item.player[0]?.playerId}`} className="flex leaderboards--row leaderboards--highlight">
                    <div className="hidden md:block my-auto w-10 text-center font-bold">{item?.placement || 0}</div>
                    <div className="w-96 md:w-96 mr-auto">
                        {item.player[0] && <PlayerCard {...item.player[0]} useTransparent isLeaderboard />}
                    </div>
                    {/* @ts-ignore */}
                    <div className="w-32 my-auto">{updateValue(fieldName, item[fieldName])}</div>
                    <div className={"w-8 md:hidden"} />
                </div>
            ))}
        </div>
    )
}

export default LeaderboardPlayerStatistic;