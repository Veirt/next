import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faWifi } from '@fortawesome/free-solid-svg-icons';
import { GamemodeData } from '../../types.client.mongo';
import Link from '../Uncategorized/Link';
import useConfig from '../../hooks/useConfig';

interface IProps {
  redirectUrl: string;
  modeData: GamemodeData;
  countdown: number;
  disabled: boolean;
  latency: number;
  className?: string;
  isCapslock?: boolean;
  isSpectate: number;
  embed?: boolean;
  embedClose?: () => void | false;
  embedOwner?: boolean;
}

const MatchBar: FC<IProps> = (props) => {
  const { redirectUrl, className, latency, isSpectate, isCapslock, embedClose, embedOwner, embed } = props;

  const { matchContainerTransparent } = useConfig();

  return (
    <>
      {!isSpectate ? (
        <div className={`game--content--bar ${matchContainerTransparent === '1' ? 'is-transparent' : ''} ${className} flex flex-wrap`}>
          {embedOwner && embedClose ? (
            <div className={`w-auto my-auto pl-3 ${!isCapslock ? 'mr-auto' : ''}`}>
              <button type={'button'} onClick={embedClose} className="text-pink-400 focus:outline-none text-sm uppercase font-semibold">
                End Match
              </button>
            </div>
          ) : !embed ? (
            <div className={`w-auto my-auto ${!isCapslock ? 'mr-auto' : ''}`}>
              <Link to={redirectUrl} className="text-orange-400 transition hover:opacity-70 focus:outline-none text-sm uppercase font-semibold">
                <FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-1" /> Leave
              </Link>
            </div>
          ) : (
            <div className={'w-auto mr-auto'} />
          )}
          {isCapslock && (
            <div className={'w-auto px-4 pt-1 text-sm mr-auto my-auto'}>
              <span className={'font-semibold text-white text-red-400'}>CAPSLOCK is Enabled</span>
            </div>
          )}
          <div className="w-auto my-auto font-semibold text-white text-right pt-px">
            <span className="pl-3 w-auto">
              <FontAwesomeIcon icon={faWifi} className="text-blue-400 mr-1" /> {latency}ms
            </span>
          </div>
        </div>
      ) : <></>}
    </>
  );
};

export default MatchBar;
