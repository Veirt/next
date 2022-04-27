import { FC } from 'react';

interface IProps {
  Progress: number;
  Quit: number;
  rounded?: boolean;
  extendedHeight?: boolean;
}

const PlayerProgress: FC<IProps> = (props) => {
  const { Progress, Quit, rounded, extendedHeight } = props;

  let heightCSS = 'h-1.25';
  if (extendedHeight) heightCSS = 'h-2';

  return (
    <div className={`bg-gray-800 ${rounded ? 'rounded-lg' : ''}`}>
      {Quit !== 1 ? (
        <div className={`progress-smooth ${Progress === 100 ? 'bg-green-400' : 'bg-blue-400'} bg-opacity-50 ${rounded ? 'rounded-lg' : ''} ${heightCSS}`} style={{ width: `${Progress || 0}%` }} />
      ) : (
        <div className={`progress-smooth ${Progress !== 100 ? `bg-red-600` : `bg-green-400`} bg-opacity-50 ${rounded ? 'rounded-lg' : ''} ${heightCSS}`} style={{ width: `${Progress || 100}%` }} />
      )}
    </div>
  );
};

export default PlayerProgress;
