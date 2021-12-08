import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircle, faClock, faGlobe, faUserFriends} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';
import {faDollarSign} from "@fortawesome/free-solid-svg-icons";
import {TournamentData} from "../../types.client.mongo";
import moment from "moment";
import Link from '../Uncategorized/Link';

interface IProps extends TournamentData {
  simpleLayout?: boolean;
  className?: string;
}

const TournamentList = (props: IProps) => {

    const { t } = useTranslation();
  
    return props.simpleLayout ? (
      <Link key={props.tournamentId}
            to={`/competitions/${props.tournamentId}`}
            className={`flex flex-wrap rounded shadow border-l-4 bg-gray-750 hover:bg-gray-775 transition ease-in-out duration-300 px-4 py-2 ${props.status ? props.status === 1 ? ' border-yellow-500 ' : ' border-red-500 ' : ' border-blue-500 ' }`}
      >
        <div className={"w-full text-sm uppercase text-white font-semibold tracking-wide truncate"}>
          {props.name}
        </div>
        <div className={"w-full"}>
          <div className={"flex text-xs text-gray-400 mt-1"}>
            <div className={"uppercase px-1 bg-gray-750 text-orange-400 py-0.5"}>
              <FontAwesomeIcon icon={faUserFriends} className={"mr-1"} />
              {props.totalPlayers.toLocaleString()}
            </div>
            <div className={"uppercase px-1.5 bg-gray-750 border-l border-gray-775 py-0.5"}>
              <FontAwesomeIcon icon={faGlobe} className={"mr-1"} />
              {props.locale}
            </div>
            <div className={"uppercase px-1.5 bg-gray-750 border-l border-gray-775 py-0.5"}>
              <FontAwesomeIcon icon={faClock} className={"mr-1"} />
              {props.status === 0 &&
              `${t('page.tournaments.starts')} ${moment.unix(props.startTime).fromNow()}`}
              {props.status === 1 &&
              `${t('page.tournaments.ends')} ${moment.unix(props.endTime).fromNow()}`}
              {props.status === 2 && `${t('page.tournaments.finished')}`}
            </div>
            {props.prizing !== 0 && (
                <div className={"uppercase px-1.5 bg-gray-750 border-l border-gray-775 text-green-500 py-0.5"}>
                  <FontAwesomeIcon icon={faDollarSign} className={"mr-1"} />
                  {props.prizing >= 25 ? props.prizing.toLocaleString() : `< 25`}
                </div>
            )}
          </div>
        </div>
      </Link>
    ) : (
        <Link to={`/competitions/${props.tournamentId}`} className="flex leaderboards--row hover:opacity-80 transition ease-in-out duration-300 py-2">
          <div className="hidden md:block w-8 text-center font-bold"></div>
          <div className="pl-6 md:pl-0 w-96 md:w-96 mr-auto text-base text-white font-semibold">{props.name}</div>
          {props.prizing !== 0 && (
              <div className="hidden md:block w-20 text-green-500 my-auto">
                <FontAwesomeIcon icon={faDollarSign} className={"mr-1"} />
                {props.prizing >= 25 ? props.prizing.toLocaleString() : `< 25`}
              </div>
          )}
          <div className="hidden md:block w-44 my-auto">
            <div className={`font-semibold  uppercase ${
                props.status
                    ? props.status === 1
                    ? ' text-yellow-500 '
                    : ' text-red-500 '
                    : ' text-blue-500 '
            }`}>
              <FontAwesomeIcon icon={faCircle} className={`text-xxs mr-1 mb-px`} />
              {props.status === 0 &&
              `${t('page.tournaments.starts')} ${moment.unix(props.startTime).fromNow()}`}
              {props.status === 1 &&
              `${t('page.tournaments.ends')} ${moment.unix(props.endTime).fromNow()}`}
              {props.status === 2 && `${t('page.tournaments.finished')}`}
            </div>
          </div>
          <div className="hidden md:block w-24 my-auto text-orange-400 font-semibold">
            <FontAwesomeIcon icon={faUserFriends} className={"mr-2"} />
            {props.totalPlayers.toLocaleString()}
          </div>
          <div className={"w-8 md:hidden"} />
      </Link>
    );
}

export default TournamentList;
