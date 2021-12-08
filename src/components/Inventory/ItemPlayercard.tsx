import { FC } from 'react';

const ItemPlayercard: FC<{ file: string }> = props => (
  <img className="shadow-lg w-full h-auto" src={`/playercards/${props.file}.png`} alt={'Playercard'} />
);
export default ItemPlayercard;
