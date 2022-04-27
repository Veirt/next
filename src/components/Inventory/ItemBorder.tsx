import { FC } from 'react';

const ItemBorder: FC<{ file: string }> = (props) => (
  <div className={`w-24 h-24 block mx-auto border-4 bg-black bg-opacity-20 border-${props.file}-400 rounded-full`} />
);
export default ItemBorder;
