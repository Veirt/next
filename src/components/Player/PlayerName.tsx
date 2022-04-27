import { FC } from 'react';
import truncate from 'truncate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDollarSign, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  name: string;
  discriminator: string;
  verified: number;
  patreon: number;
  staff: number;

  showDiscriminator?: boolean;
  useSmall?: boolean;
  useBig?: boolean;
}

const PlayerName: FC<IProps> = (props) => {
  const { name, discriminator, verified, patreon, staff, showDiscriminator, useSmall, useBig } = props;

  return (
    <div className={`flex space-x-2  ${useSmall ? 'text-xs sm:text-sm md:text-base' : useBig ? 'text-lg sm:text-xl md:text-2xl' : 'text-sm sm:text-base md:text-lg'}`}>
      <div className={`truncate font-semibold text-white`}>
        {truncate(name, 14)}
        {showDiscriminator && <span className={'text-gray-500'}>#{discriminator}</span>}
      </div>
      {verified === 1 && <FontAwesomeIcon className="my-auto block text-orange-400" icon={faCheckCircle} />}
      {patreon === 1 && (
        <div className="my-auto" title="Patreon Supporter">
          <FontAwesomeIcon className="text-orange-400" icon={faDollarSign} />
        </div>
      )}
      {staff === 1 && (
        <div className="my-auto" title="Staff">
          <FontAwesomeIcon className="text-orange-400" icon={faShieldAlt} />
        </div>
      )}
    </div>
  );
};

export default PlayerName;
