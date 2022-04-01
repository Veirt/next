import { FC } from 'react';

const ItemNFT: FC<{ file: string }> = props => (
    <div className="flex justify-center">
        <img className="w-16 h-16" src={`/nft/${props.file}.svg`} alt={'NFT'} />
    </div>
);
export default ItemNFT;
