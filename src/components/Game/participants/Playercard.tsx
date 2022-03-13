import { FC } from 'react';
import {SocketMatchPlayerData} from "../../../types.client.socket";
import PlayerCard from "../../../components/Player/PlayerCard";
import PlayerProgress from "./PlayerProgress";
import useConfig from "../../../hooks/useConfig";
import PlayerPlacement from "./PlayerPlacement";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PlayerExperience from "../../../components/Player/PlayerExperience";

interface IProps {
    participantsData: SocketMatchPlayerData[];
    firstWord?: string;
    modeId: number;
    roundLimit: number;
    isFinished: boolean;
}

const Playercard:FC<IProps> = (props) => {

    const { participantsData, firstWord, modeId, roundLimit, isFinished } = props;
    const { hideWPM, useCPM } = useConfig();

    return (
        <div className={`flex flex-wrap ${modeId === 1 ? `justify-center lg:justify-between ${!isFinished ? 'pt-0' : 'pt-6' }` : 'justify-center py-6'} gap-4`}>
            {participantsData.map((item) => item.teamId !== 0 && (
                <div key={item.playerId} className={"relative w-76"}>
                    <div className={`rounded ${modeId === 1 ? 'rounded-t-none' : ''} shadow-lg border border-gray-750`}>
                        <PlayerCard
                            className={`px-4 py-2 ${modeId === 1 ? 'rounded-t-none' : 'rounded-t'}`}
                            cardBorder={item.cardBorder}
                            cardImage={item.cardImage}
                            name={item.name}
                            discriminator={item.discriminator}
                            avatarSrc={item.avatarSrc}
                            verified={item.verified}
                            patreon={item.patreon}
                            staff={item.staff}
                        >
                            <div>
                                <div className={"w-auto block text-xs uppercase font-semibold text-white"}>
                                    Level <span className={"text-orange-400"}>{item.Level.Index}</span>
                                </div>
                                <PlayerExperience experience={item.experience} level={item.Level.Index} next={item.Level.Next} percentage={item.Level.Percentage} />
                            </div>
                        </PlayerCard>
                        {firstWord && (
                            <div className={"bg-gray-775"}>
                                <PlayerProgress Progress={item.Progress || 0} Quit={item.Quit} />
                                <div className={"flex justify-between px-3 py-1 text-white"}>
                                    <div className={"w-auto my-auto"}>
                                        {hideWPM === '0' && (
                                            <>
                                                {item.WPM ? item.WPM.toFixed(2) : 0}
                                                <span className="font-bold"> {useCPM === '1' ? 'CPM' : 'WPM'}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className={"w-32 my-auto text-right"}>
                                        {(!item.Placement || item.Placement === 0)
                                            ? <div className="truncate font-semibold text-orange-400">{item.currentWord || firstWord}</div>
                                            : <PlayerPlacement placement={item.Placement} placementFinal={item.PlacementFinal} />
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {roundLimit >= 1 && (
                        <div className={"flex justify-center gap-4 text-xs md:text-sm pt-2"}>
                            {[...Array(roundLimit)].map((_circle, index) => (index < (item.roundsWon ? item.roundsWon : 0))
                                ? <FontAwesomeIcon icon={faCircle} className={"text-orange-400"} />
                                : <FontAwesomeIcon icon={faCircle} className={"text-gray-600"} />
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Playercard;