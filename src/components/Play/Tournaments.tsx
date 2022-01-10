import {TournamentData} from "../../types.client.mongo";
import Challenge from "../../components/Challenges/Challenge";
import {useTranslation} from "next-i18next";
import TournamentList from "../Tournament/TournamentList";

interface IProps {
    data: TournamentData[];
}

const Tournaments = (props: IProps) => {

    const { data } = props;

    const { t } = useTranslation();

    return (data && data.length !== 0) ? (
        <div>
            <div className="h1">{t('component.navbar.tournaments')}</div>
            <p className="block pb-6 pt-2"> 
                See how you match with players worldwide.
            </p>
            <div className="grid grid-cols-1 gap-6">
                {data.map((item) => (item.status === 1) && (
                    <div key={item.tournamentId}>
                        <TournamentList {...item} simpleLayout />
                    </div>
                ))}
            </div>
        </div>
    ) : <></>;
}

export default Tournaments;