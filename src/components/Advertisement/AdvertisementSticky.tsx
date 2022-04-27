import { toggleAds } from '../../Config';
import { usePlayerContext } from '../../contexts/Player.context';
import AdvertisementUnit from './Units/AdvertisementUnit';

interface IProps {
  position?: 'left' | 'right';
  className?: string;
}

const AdvertisementSticky = (props: IProps) => {
  const { position, className } = props;
  const { sessionData } = usePlayerContext();

  let useCSS = className || '';
  if (position === 'left') useCSS = 'left-4';
  else if (position === 'right') useCSS = 'right-4';

  return toggleAds && sessionData && !sessionData.patreon && !sessionData.staff ? (
    <div className={`absolute top-6 ${useCSS} hidden ads:block`}>
      <AdvertisementUnit type={`skyscraper-${position === 'left' ? 'one' : 'two'}`} />
    </div>
  ) : (
    <></>
  );
};

export default AdvertisementSticky;
