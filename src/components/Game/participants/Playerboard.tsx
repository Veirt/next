import {SocketMatchPlayerData} from "../../../types.client.socket";
import PlayerCard from "../../../components/Player/PlayerCard";
import PlayerProgress from "./PlayerProgress";
import useConfig from "../../../hooks/useConfig";
import PlayerPlacement from "./PlayerPlacement";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PlayerExperience from "../../../components/Player/PlayerExperience";
import {useTranslation} from "next-i18next";

interface IProps {
    participantsData: SocketMatchPlayerData[];
    firstWord?: string;
    modeId: number;
    roundLimit: number;
    isSpectator: number;
    quoteString: string;
    borderColors?: string[];
}

const Playerboard = (props: IProps) => {

    const { participantsData, firstWord, roundLimit, isSpectator, quoteString, borderColors } = props;
    const { hideWPM, useCPM } = useConfig();
    const { t } = useTranslation();

    return (
        <div className={`grid grid-cols-1 gap-4 ${!isSpectator ? 'pt-6' : ''}`}>
            {participantsData.map((item, index) => item.teamId !== 0 && (
                <div key={item.playerId} className={`relative hidden shadow-lg md:flex flex-wrap text-gray-500 bg-gray-750 w-full font-semibold text-xs tracking-wider border-l-4 ${(borderColors && isSpectator === 1) ? (borderColors[index] ? borderColors[index] : borderColors[1]) : 'border-orange-400'}`}>
                    <div className={"w-full bg-gray-750"}>
                        <PlayerProgress Progress={item.Progress} Quit={item.Quit} />
                    </div>
                    <div className={`w-1/2 md:w-64`}>
                        <PlayerCard
                            className={`px-4 py-2.5`}
                            cardBorder={item.cardBorder}
                            cardImage={item.cardImage}
                            name={item.name}
                            discriminator={item.discriminator}
                            avatarSrc={item.avatarSrc}
                            verified={item.verified}
                            patreon={item.patreon}
                            staff={item.staff}
                            useTransparent
                        >
                            <div>
                                <div className={"w-auto block text-xs uppercase font-semibold text-white"}>
                                    Level <span className={"text-orange-400"}>{item.Level.Index}</span>
                                </div>
                                <PlayerExperience experience={item.experience} level={item.Level.Index} next={item.Level.Next} percentage={item.Level.Percentage} />
                            </div>
                        </PlayerCard>
                    </div>
                    <div className={"w-2/4 md:w-40 px-4 my-auto"}>
                        {roundLimit >= 1 ? (
                            <div className={"flex justify-center gap-4 text-xs md:text-sm"}>
                                {[...Array(roundLimit)].map((index) => (index < (item.roundsWon ? item.roundsWon : 0))
                                    ? <FontAwesomeIcon icon={faCircle} className={"text-orange-400"} />
                                    : <FontAwesomeIcon icon={faCircle} className={"text-gray-600"} />
                                )}
                            </div>
                        ) : item.Placement ? <PlayerPlacement placement={item.Placement} placementFinal={item.PlacementFinal} /> : '-'}
                    </div>
                    <div className={"w-2/4 md:w-60 my-auto"}>
                        {isSpectator ? (
                            <>
                                {item.Progress !== 100 && quoteString !== "KEYMASH_GAMEMODE_ROUND_END" ? (
                                    <div className={"truncate px-3 py-1 rounded bg-gray-700 font-semibold text-white"}>
                                        {item.correctKeystrokeString || ''}<span className={"border-b border-orange-400 text-orange-400"}>{item.currentKeystroke ? item.currentKeystroke : (firstWord ? firstWord[0] : '')}</span>
                                    </div>
                                ) : (item.Progress === 100 || quoteString === "KEYMASH_GAMEMODE_ROUND_END") && <div className={"text-gray-500 uppercase text-base font-semibold tracking-wide"}>{t('other.finished')}</div>}
                            </>
                        ) : (
                            <>
                                {item.Progress !== 100 && quoteString !== "KEYMASH_GAMEMODE_ROUND_END"
                                    ? <div className={"truncate font-semibold text-white text-base text-center"}>{item.currentWord || firstWord}</div>
                                    : (item.Progress === 100 || quoteString === "KEYMASH_GAMEMODE_ROUND_END") && <div className={"text-gray-500 uppercase text-base font-semibold tracking-wide"}>{t('other.finished')}</div>}
                            </>
                        )}
                    </div>
                    <div className={"w-1/4 text-right md:w-24 ml-auto my-auto pr-3"}>
                        {firstWord && (
                            <span className={"text-lg uppercase font-semibold text-white"}>
                                {item.Accuracy ? Math.round(item.Accuracy) : 100}%
                            </span>
                        )}
                    </div>
                    <div className={"w-1/4 text-right md:w-32 my-auto pr-3"}>
                        {firstWord && (
                            <div className={"w-auto my-auto"}>
                                {hideWPM === '0' && (
                                    <span className={"text-lg font-semibold text-white"}>
                                        {item.WPM ? item.WPM.toFixed(2) : 0}
                                        <span className="text-gray-400">{useCPM === '1' ? 'cpm' : 'wpm'}</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Playerboard;