import { FC } from 'react';

interface IProps {
  timer: number;
}

const GameTimer: FC<IProps> = (props) => {
  const newTimer = new Date(props.timer * 1000).toISOString().substr(14, 5);
  return <span>{newTimer}</span>;
};

export default GameTimer;
