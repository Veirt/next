import { FC } from 'react';
import ItemPlayercard from "../Inventory/ItemPlayercard";
import ItemBanner from "../Inventory/ItemBanner";
import ItemBorder from "../Inventory/ItemBorder";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleRight, faCoins} from "@fortawesome/free-solid-svg-icons";
import {ItemData, PlayerShopData} from "../../types.client.mongo";
import {useTranslation} from "next-i18next";

interface IProps extends ItemData {
    player: PlayerShopData;
    itemType: string;
    showType?: boolean;
    purchaseItem: (file: string, price: number) => void;
}

const ShopItem:FC<IProps> = (props) => {
    const { t } = useTranslation();

    return (
        <div className={`relative bg-gray-775 rounded-lg shadow-lg ${props.level > props.player.level.Index || props.price > props.player.currency || props.player.inventory.includes(props.file) ? 'opacity-70' : ''}`}>
            {props.showType && (
                <div className={"absolute top-0 right-5 -mt-2 text-white uppercase font-semibold text-xs bg-gray-700 px-3 rounded-full"}>
                    {(t(props.itemType)).substring(0, t(props.itemType).length - 1)}
                </div>
            )}
            <div className={'flex h-32 bg-gray-900 rounded-t-lg'}>
                <div className={'w-4/5 m-auto'}>
                    <div className={'transition ease-in-out duration-300 hover:transform hover:scale-110'}>
                        {props.itemType === 'page.shop.playercards' ? (
                            <ItemPlayercard file={props.file} />
                        ) : props.itemType === 'page.shop.banners' ? (
                            <ItemBanner file={props.file} />
                        ) : (
                            <ItemBorder file={props.file} />
                        )}
                    </div>
                </div>
            </div>
            <div className={'p-3'}>
                <div className={'text-base uppercase text-white font-semibold'}>{props.name}</div>
                <div className={'flex justify-between text-sm mt-2'}>
                    <div className={"w-auto"}>
                        {!props.player.inventory.includes(props.file) ? (
                            <>
                                {props.level > props.player.level.Index
                                    ? <span className={"text-gray-400 uppercase font-semibold"}>Unlock at Level {props.level}</span>
                                    : props.price > props.player.currency
                                        ? <span className={"text-gray-400 uppercase font-semibold"}>Not enough coins</span>
                                        : (
                                            <button
                                                type={'button'}
                                                className={'focus:outline-none bg-orange-400 hover:bg-orange-300 text-orange-900 rounded-full transition ease-in-out duration-300 font-semibold uppercase px-4 text-xs py-1'}
                                                onClick={() => props.purchaseItem(props.file, props.price)}
                                            >
                                                <FontAwesomeIcon icon={faAngleDoubleRight} className={'mr-px'} /> Purchase
                                            </button>
                                        )
                                }
                            </>
                        ) : <span className={"text-gray-400 uppercase font-semibold"}>Purchased</span>}
                    </div>
                    <div className={"w-auto my-auto"}>
                        {!props.player.inventory.includes(props.file) && (
                            <div className={"bg-black bg-opacity-40 text-white text-sm uppercase font-semibold px-4 py-0.5 rounded-xl"}>
                                <FontAwesomeIcon icon={faCoins} className={'text-yellow-400'} /> {props.price.toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopItem;