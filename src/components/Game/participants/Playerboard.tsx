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

const getCorrectKeystrokeString = (quote: string, correctKeystrokes: number) => {
    const useStartIndex = correctKeystrokes > 33 ? correctKeystrokes - 33 : 0;
    return quote.substring(useStartIndex, correctKeystrokes - 1);
}

const Playerboard = (props: IProps) => {

    const { participantsData, firstWord, roundLimit, isSpectator, quoteString, borderColors } = props;
    const { hideWPM, useCPM } = useConfig();
    const { t } = useTranslation();

    return (
        <div className={`grid grid-cols-1 gap-4 ${!isSpectator ? 'pt-6' : ''}`}>
            {participantsData.map((item, index) => (firstWord && item.teamId !== 0) && (
                <div key={item.playerId} className={`overflow-hidden relative shadow-lg flex flex-wrap text-gray-500 bg-gray-750 w-full pt-1 font-semibold text-xs rounded-xl`}>
                    <div className={"absolute top-0 left-0 w-full overflow-none"}>
                        <PlayerProgress Progress={item.Progress} Quit={item.Quit} extendedHeight />
                    </div>
                    <div className={`w-auto h-full mt-1 border-l-4 rounded-b-xl ${(borderColors && isSpectator === 1) ? (borderColors[index] ? borderColors[index] : borderColors[1]) : 'border-orange-400'}`} />
                    <div className={`w-full sm:w-1/3 md:w-64`}>
                        <PlayerCard
                            className={`pl-4 pr-2 py-2.5`}
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
                    <div className={"w-auto px-6 my-auto ml-auto"}>
                        {roundLimit >= 1 ? (
                            <div className={"flex justify-center gap-3 text-xs md:text-sm"}>
                                {[...Array(roundLimit)].map((index) => (index < (item.roundsWon ? item.roundsWon : 0))
                                    ? <FontAwesomeIcon icon={faCircle} className={"text-orange-400"} />
                                    : <FontAwesomeIcon icon={faCircle} className={"text-gray-600"} />
                                )}
                            </div> 
                        ) : item.Placement ? <PlayerPlacement placement={item.Placement} placementFinal={item.PlacementFinal} replayText={quoteString} replay={item.Replay} /> : ''}
                    </div>
                    <div className={"hidden lg:block w-60 my-auto"}>
                        {isSpectator ? (
                            <>
                                {item.Progress !== 100 && quoteString !== "KEYMASH_GAMEMODE_ROUND_END" ? (
                                    <div className={"truncate px-3 h-6 pt-1 rounded bg-gray-700 font-semibold text-white"}>
                                        {getCorrectKeystrokeString(quoteString, (item?.wordLetterIndex || 0)) + ' '}
                                        <span className={"border-b border-orange-400 text-orange-400"}>
                                            {item.currentInput || ''}
                                        </span>
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
                    <div className={"hidden lg:block w-24 text-right ml-auto my-auto pr-3"}>
                        <span className={"text-lg uppercase font-semibold text-white"}>
                            {item.Accuracy ? Math.round(item.Accuracy) : 100}
                            <span className="text-gray-400">%</span>
                        </span>
                    </div>
                    <div className={"text-right w-32 my-auto pr-4"}>
                        <div className={"w-auto my-auto"}>
                            {hideWPM === '0' && (
                                <span className={"text-lg font-semibold text-white"}>
                                    {item.WPM ? item.WPM.toFixed(2) : 0}
                                    <span className="text-gray-400">{useCPM === '1' ? 'cpm' : 'wpm'}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Playerboard;