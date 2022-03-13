import {PlayerChallengeData} from "../../types.client.mongo";
import Challenge from "../../components/Challenges/Challenge";
import {useTranslation} from "next-i18next";

interface IProps {
    data: PlayerChallengeData[];
}

const Challenges = (props: IProps) => {

    const { data } = props;

    const { t } = useTranslation();

    return (data && data.length !== 0) ? (
        <div>
            <div className="h1">{t('component.navbar.challenges')}</div>
            <p className="text-gray-300 pb-6 pt-2">
                You will be given two challenges every day.
            </p>
            <div className="grid grid-cols-1 gap-6">
                {data.map((item) => (
                    <div key={item.challengeId} className={"col-span-full p-4 bg-gray-800 border border-gray-775 rounded-xl"}>
                        <Challenge {...item} />
                    </div>
                ))}
            </div>
        </div>
    ) : <></>;
}

export default Challenges;