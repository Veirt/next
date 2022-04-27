import { FC, ReactElement } from 'react';
import PlayerAvatar from './PlayerAvatar';
import PlayerName from './PlayerName';
import { PlayerExtendedData } from '../../types.client.mongo';
import Link from '../Uncategorized/Link';

interface IProps {
  cardBorder: string;
  cardImage: string;
  className?: string;
  name: string;
  discriminator: string;
  avatarSrc: string;
  verified?: number;
  patreon?: number;
  staff?: number;

  noBorder?: boolean;
  noImage?: boolean;
  draggable?: boolean;
  children?: ReactElement | JSX.Element[] | Element[];
  useTransparent?: boolean;
  isLeaderboard?: boolean;
  useSmall?: boolean;
}

interface IPropsWithPlayer extends PlayerExtendedData {
  className?: string;
  noBorder?: boolean;
  noImage?: boolean;
  draggable?: boolean;
  children?: ReactElement | JSX.Element[] | Element[];
  useTransparent?: boolean;
  isLeaderboard?: boolean;
  useSmall?: boolean;
}

const PlayerCard: FC<IProps | IPropsWithPlayer> = (props) => {
  const {
    cardImage,
    cardBorder,
    className,
    name,
    discriminator,
    draggable,
    avatarSrc,
    verified,
    patreon,
    staff,
    noBorder,
    noImage,
    useTransparent,
    isLeaderboard,
    useSmall,
    children,
  } = props;

  const useImageCSS = isLeaderboard ? 'hidden md:block w-8' : 'hidden md:block w-16';

  return (
    <div
      style={
        noImage
          ? {}
          : {
              borderColor: 'rgba(34, 40, 52)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url('/playercards/${cardImage ? cardImage : 'dotted_generic'}${
                useTransparent ? '_transparent' : ''
              }.png')`,
            }
      }
      className={`${className} ${isLeaderboard ? 'px-4 py-2 md:py-1.5' : ''}`}
    >
      <div className={'flex'} draggable={draggable ? 'true' : 'false'}>
        <Link to={`/profile/${name}-${discriminator}`} className={useImageCSS}>
          <PlayerAvatar source={avatarSrc} border={noBorder ? 1 : 2} color={cardBorder} />
        </Link>
        <div className={`w-full my-auto pl-2.5`}>
          <Link to={`/profile/${name}-${discriminator}`}>
            <PlayerName
              name={name}
              discriminator={discriminator}
              verified={verified || 0}
              patreon={patreon || 0}
              staff={staff || 0}
              useSmall={isLeaderboard || useSmall}
            />
          </Link>
          {children ? <div className={'-mt-0.5'}>{children}</div> : <></>}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
