import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { AchievementData } from '../../types.client.mongo';
import { PlayerAchievementExtendedData } from '../Profile/ProfileAchievements';

interface IProps extends PlayerAchievementExtendedData, AchievementData {
  achievementId: string;
}

const AchievementItem = (props: IProps) => {
  return (
    <div className={`${props.value ? 'opacity-100' : 'opacity-50'} text-left`}>
      <div className={'flex text-white'}>
        <div className={'w-20 text-center my-auto -mr-8 z-20'}>
          <img className={'w-full h-auto filter drop-shadow-lg'} src={`/achievements/${props.achievementId}.png`} alt={``} />
        </div>
        <div className={'w-full my-auto bg-gray-700 rounded-xl pl-12 py-2 shadow'}>
          <div className={'text-lg font-semibold'}>{props.title}</div>
          {props.value ? (
            <div className={'text-sm -mt-0.5 text-gray-400'}>{moment.unix(props.created).fromNow()}</div>
          ) : (
            <div className={'text-sm -mt-0.5'}>
              <FontAwesomeIcon icon={faCircle} className={'text-yellow-400 mr-1'} />
              {props.exp >= 1000 ? `${props.exp / 1000}K` : `${props.exp}`} EXP
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementItem;
