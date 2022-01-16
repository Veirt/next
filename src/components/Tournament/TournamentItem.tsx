import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClock, faUserFriends} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';
import {faDollarSign} from "@fortawesome/free-solid-svg-icons";
import {TournamentData} from "../../types.client.mongo";
import moment from "moment";
import Link from '../Uncategorized/Link';

interface IProps extends TournamentData {
  className?: string;
}

const TournamentItem = (props: IProps) => {

    const { t } = useTranslation();
  
    return (
        <Link key={props.tournamentId} to={`/competitions/${props.tournamentId}`} className={`block w-full p-4 bg-gray-800 hover:bg-gray-825 border border-gray-775 rounded-xl transition ease-in-out duration-300`}>
            <div className={"h4 text-orange-400 truncate"}>
                {props.name.split('(')[0]}
            </div>
            <p className="block pt-2 text-sm">
                {(!props.info || props.info.length)
                  ? 'No information is currently available at this time. Please check back later!'
                  : `${props.info.split('.')[0]}.${props.info.split('.')[1]}.`
                }
            </p>
            <div className={"w-full mt-5"}>
                <div className={"flex space-x-2 text-sm"}>
                    <div className={"uppercase px-3 py-1.5 bg-gray-825 rounded-lg"}>
                        <FontAwesomeIcon icon={faUserFriends} className={"mr-1 text-orange-400"} />
                        {props.totalPlayers.toLocaleString()}
                    </div>
                    <div className={"uppercase px-3 py-1.5 bg-gray-825 rounded-lg"}>
                        <FontAwesomeIcon icon={faClock} className={"mr-1 text-orange-400"} />
                        {props.status === 0 &&
                        `${t('page.tournaments.starts')} ${moment.unix(props.startTime).fromNow()}`}
                        {props.status === 1 &&
                        `${t('page.tournaments.ends')} ${moment.unix(props.endTime).fromNow()}`} 
                        {props.status === 2 && `${t('page.tournaments.finished')}`}
                    </div>
                    {props.prizing !== 0 && (
                        <div className={"uppercase px-3 py-1.5 bg-gray-825 rounded-lg"}>
                          <FontAwesomeIcon icon={faDollarSign} className={"mr-1"} />
                          {props.prizing >= 25 ? props.prizing.toLocaleString() : `< 25`}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default TournamentItem;
