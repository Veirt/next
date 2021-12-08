import {FC} from 'react';
import {PlayerMatchData, TextData} from "../../types.client.mongo";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrophy} from "@fortawesome/free-solid-svg-icons";
import ordinalSuffixOf from "../../utils/ordinalSuffixOf";
import useConfig from "../../hooks/useConfig";

export interface PlayerMatchProfileExtendedData extends PlayerMatchData {
    text: TextData[];
}

interface IProps {
    data: PlayerMatchProfileExtendedData[];
    skip: number;
}

const LeaderboardPlayerProfile:FC<IProps> = (props) => {
    const { data } = props;
    const { useCPM } = useConfig();

    return (
        <div>
            <div className="flex leaderboards--head">
                <div className="hidden md:block w-20 text-center font-bold">#</div>
                <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto">Name</div>
                <div className="hidden md:block w-24">EXP</div>
                <div className="hidden md:block w-24">Acc %</div>
                <div className="hidden md:block w-32">Speed</div>
                <div className="hidden md:block w-32">Time</div>
                <div className={"w-8 md:hidden"} />
            </div>

            {data.map((item) => (
                <div key={item.matchId} className="flex leaderboards--row">
                    <div className="hidden md:block w-20 text-center font-bold my-auto">
                        {(item.placement && item.placement <= 3) ? <FontAwesomeIcon icon={faTrophy} className={`${item.placement === 1 ? 'text-yellow-300' : item.placement === 2 ? 'text-gray-300' : 'text-orange-700'} mr-1`} /> : ''}
                        <span className={"uppercase text-xs"}>
                            {item.placement ? `${ordinalSuffixOf(item.placement)}` : 'QUIT'}
                        </span>
                    </div>
                    <div className="pl-6 md:pl-0 w-96 md:w-96 py-3 truncate mr-auto">
                        {item.text[0]?.content}
                    </div>
                    {item.placement
                        ? (
                            <>
                                <div className="hidden md:block w-24 my-auto">{item.exp} EXP</div>
                                <div className="hidden md:block w-24 my-auto">{item.accuracy}%</div>
                                <div className="w-32 my-auto">{useCPM === '1' ? `${(item.wpm * 5).toFixed(2)} CPM` : `${item.wpm.toFixed(2)} WPM`}</div>
                            </>
                        ) : (
                            <>
                                <div className="hidden md:block w-24 my-auto">N/A</div>
                                <div className="hidden md:block w-24 my-auto">N/A</div>
                                <div className="w-32 my-auto">N/A</div>
                            </>
                        )
                    }
                    <div className="hidden md:block w-32 my-auto">{moment.unix(item.created).fromNow()}</div>
                    <div className={"w-8 md:hidden"} />
                </div>
            ))}
        </div>
    )
}

export default LeaderboardPlayerProfile;