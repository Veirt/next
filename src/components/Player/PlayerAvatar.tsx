import { FC, useEffect, useState } from 'react';

export interface UserAvatarProps {
  source?: string;
  border?: number;
  color?: string;
  hideBorder?: boolean;
}

const PlayerAvatar: FC<UserAvatarProps> = (props) => {
  const [image, setImage] = useState(props.source);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const { source, hideBorder } = props;
  let { border, color } = props;

  const onError = () => {
    console.log('errored for ' + props.source);
    if (!errored) {
      setErrored(true);
    }
  };

  const onLoad = () => {
    if (!loaded) setLoaded(true);
  };

  useEffect(() => {
    if (errored || !source) setImage(`/avatars/default1.jpg`);
    else setImage(source);
  }, [image, errored, source]);

  if (!border) border = 2;
  if (!color) color = 'orange';

  // Tailwind Safe Purge: border-yellow-400 border-4
  return (
    <>
      <img
        src={image}
        className={`w-full h-auto rounded-full ${loaded && !hideBorder && `border-${border} border-${color}-400`} ${
          !hideBorder && 'bg-black bg-opacity-50'
        }`}
        height={20}
        width={20}
        alt="Avatar"
        onLoad={onLoad}
        onError={onError}
      />
    </>
  );
};

export default PlayerAvatar;
