import {FC} from "react";
import {PlayerAchievementData} from "../../types.client.mongo";
import {useTranslation} from "next-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

export interface PlayerAchievementExtendedData extends PlayerAchievementData {
    value?: number;
    key: string;
    title: string;
    type: string;
}

interface IProps {
    data: PlayerAchievementExtendedData[];
}

const ProfileAchievements: FC<IProps> = (props) => {

    const { t } = useTranslation();
    const achievementsData = Object.values(props.data);

    const sections = [
        {
            key: "maxWPM",
            string: "page.achievements.personal_best"
        },
        {
            key: "CasualMatchesTotal",
            string: "page.achievements.matches_played"
        },
        {
            key: "CasualMatchesWon",
            string: "page.achievements.matches_won"
        },
        {
            key: "TotalTime",
            string: "page.achievements.playtime"
        }
    ]


    return (
        <div className="content-box">
            {sections.map((section) => (
                <div key={section.string} className={"mb-8 mt-4"}>
                    <h3 className={"text-white font-semibold pb-3"}>{t(section.string)}</h3>
                    <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"}>
                        {achievementsData.map((item) => item.type === section.key && (
                            <div className={`${item.value ? 'opacity-100' : 'opacity-50'}`}>
                                <div className={"flex text-white"}>
                                    <div className={"w-20 text-center my-auto -mr-8 z-20"}>
                                        <img className={"w-full h-auto filter drop-shadow-lg"} src={`/achievements/${item.key}.png`} alt={``} />
                                    </div>
                                    <div className={"w-full my-auto bg-gray-700 rounded-xl pl-12 py-2 shadow"}>
                                        <div className={"text-lg font-semibold"}>{item.title}</div>
                                        {item.value ? (
                                            <div className={"text-sm -mt-0.5 text-gray-400"}>
                                                {moment.unix(item.created).fromNow()}
                                            </div>
                                        ) : (
                                            <div className={"text-sm -mt-0.5"}>
                                                <FontAwesomeIcon icon={faCircle} className={"text-yellow-400 mr-1"} />
                                                {item.exp >= 1000 ? `${item.exp / 1000}K` : `${item.exp}`} EXP
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProfileAchievements;