import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAward, faCircleNotch, faGamepad, faHandHoldingUsd, faExclamationTriangle, faTrophy, faUserShield, faBullhorn, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PlayerNotificationData } from '../../types.client.mongo';
import moment from 'moment';
import React from 'react';
import Link from './Link';

interface IProps extends PlayerNotificationData {
  sizeBig?: boolean;
}

const Notification = (props: IProps) => {
  const { type, location, read, message, created } = props;
  let icon: IconDefinition = faCircleNotch;
  let color = 'text-gray-300';
  let title = 'Admin Notice';

  switch (type) {
    case 'police':
      icon = faExclamationTriangle;
      title = 'Admin Notice';
      color = 'text-red-500';
      break;
    case 'account':
      icon = faUserShield;
      title = 'Account Security';
      color = 'text-orange-500';
      break;
    case 'achievement':
      icon = faAward;
      title = 'Congratulations!';
      color = 'text-green-500';
      break;
    case 'level':
      icon = faLevelUpAlt;
      title = 'Leveled Up!';
      color = 'text-blue-300';
      break;
    case 'news':
      icon = faBullhorn;
      title = 'Announcement';
      color = 'text-yellow-500';
      break;
    case 'reward':
      title = 'Rewarded!';
      icon = faHandHoldingUsd;
      color = 'text-blue-400';
      break;
    case 'tournament':
      title = 'Tournaments';
      icon = faTrophy;
      color = 'text-yellow-400';
      break;
    case 'game':
      icon = faGamepad;
      break;
  }

  const useCSS = `flex py-5 border-b border-gray-700 ${!read ? 'bg-white bg-opacity-5' : 'bg-transparent'} hover:bg-white hover:bg-opacity-5 transition ease-in-out duration-300`;

  if (location && location !== '')
    return (
      <Link to={location} className={useCSS}>
        <div className="w-16">
          <FontAwesomeIcon className={`${color} border-2xl`} icon={icon} />
        </div>
        <div className="w-full pr-2">
          <div className="text-xl font-semibold text-white">{title}</div>
          <div className="border-white font-semibold uppercase border-sm break-normal">{message}</div>
          <div className="border-gray-500 font-semibold uppercase border-xxs">{moment.unix(created).fromNow()}</div>
        </div>
      </Link>
    );
  else
    return (
      <div className={useCSS}>
        <div className="w-20 text-center">
          <FontAwesomeIcon className={`text-orange-400 text-2xl mt-2`} icon={icon} />
        </div>
        <div className="w-full pr-2">
          <div className="flex flex-wrap md:flex-nowrap">
            <div className="w-auto mr-auto">
              <div className="text-base font- text-white">{message}</div>
              <div className="text-gray-500 font-semibold uppercase text-sm pt-1.5">{moment.unix(created).fromNow()}</div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Notification;
