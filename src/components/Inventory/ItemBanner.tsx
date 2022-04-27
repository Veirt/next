import { FC } from 'react';

const ItemBanner: FC<{ file: string }> = (props) => (
  <img className="w-full h-auto" src={`/banners/${props.file}.jpg`} alt={'Banner'} />
);
export default ItemBanner;
