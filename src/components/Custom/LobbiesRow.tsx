import React, { FC } from 'react';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {LobbyData} from "../../types.client.mongo";
import PlayerCard from "../Player/PlayerCard";
import Link from '../Uncategorized/Link';


const LobbiesRow: FC<LobbyData> = (props) => {

    return (props.cardImage && props.cardBorder && props.name && props.avatarSrc) ? (
      <Link to={`/custom/${props.invite}`} className="flex bg-gray-775 hover:bg-gray-800 shadow-md mb-2 rounded transition ease-in-out duration-200">
          <PlayerCard className="pointer-events-none w-52 px-4 py-2 rounded-l" useTransparent useSmall cardBorder={props.cardBorder} cardImage={props.cardImage} name={props.name} discriminator={'0'} avatarSrc={props.avatarSrc} verified={props.verified} patreon={props.patreon} staff={props.staff} />
          <div className="w-24 text-center ml-auto my-auto">
              <FontAwesomeIcon className="mr-2 text-orange-400" icon={faUserFriends} />
              <span className="text-white">{props.playerList.length.toLocaleString()}</span>
          </div>
      </Link>
    ) : <></>;
}

export default LobbiesRow;
