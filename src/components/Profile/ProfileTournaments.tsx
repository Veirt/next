import {PlayerTournamentData, TournamentData} from "../../types.client.mongo";
import {useTranslation} from "next-i18next";
import {faClock, faGlobe} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ordinalSuffixOf from "../../utils/ordinalSuffixOf";
import Link from "../Uncategorized/Link";
import moment from "moment";

export interface PlayerTournamentExtendedData extends PlayerTournamentData {
    tournament: TournamentData[];
}

interface IProps {
    data: PlayerTournamentExtendedData[];
}

const ProfileTournaments = (props: IProps) => {

    const { data } = props;
    const { t } = useTranslation();

    return (
        <div className="content-box">
            {data && data.length !== 0 ? (
                <div className={"grid grid-cols-1 md:grid-cols-2 4xl:grid-cols-3 gap-4"}>
                    {data.map((item) => (item?.placement !== -1 && item?.placement !== 0) && (
                        <Link key={item.tournamentId} to={`/competitions/${item.tournamentId}`} >
                            <div className={"flex text-white hover:opacity-70 transition ease-in-out duration-300"}>
                                <div className={"w-20 text-center my-auto -mr-8 z-20"}>
                                    <div className="relative">
                                        <img className={"w-full h-auto filter drop-shadow-lg"} src={`/badges/${(item.placement && item.placement <= 5) ? item.placement : 'participant'}.png`} alt={``} />
                                        {(item.placement && item.placement > 3) ? (
                                            <div className="absolute text-center text-lg text-white w-10 mx-auto bottom-7 left-0 right-0 font-bold rounded-lg">
                                                {ordinalSuffixOf(item.placement || 0)}
                                            </div>
                                        ) : <></>}
                                    </div>
                                </div>
                                <div className={"w-full my-auto bg-gray-700 rounded-xl pl-12 py-2 shadow pl-4"}>
                                    <div className={"uppercase text-base lg:text-base font-semibold"}>{item.tournament[0]?.name}</div>
                                    <div className="flex space-x-4 text-xs lg:text-sm pt-1 uppercase">
                                      <div>
                                            <FontAwesomeIcon icon={faGlobe} className={"mr-1"} />
                                            {item.tournament[0]?.locale}
                                        </div>
                                        <div>
                                            <FontAwesomeIcon icon={faClock} className={"mr-1"} />
                                            {moment.unix(item.created).fromNow()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={"text-center text-lg bg-gray-750 py-32 uppercase font-semibold text-white"}>
                    This player has not participated in any tournaments recently.
                </div>
            )}

        </div>
    )
}

export default ProfileTournaments;