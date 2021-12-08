import {FC} from "react";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TwitchData} from "../../types.client.mongo";

interface IProps extends TwitchData {
    isList?: boolean;
}

const Stream: FC<IProps> = (props) => {

    return (
        !props.isList ? (
            <div className="h-full">
                <a href={`https://twitch.tv/${props.name}`} target={"_blank"} rel="noreferrer">
                    <div className={"bg-gray-775 hover:bg-gray-800 transition ease-in-out duration-200 rounded shadow"}>
                        <img src={props.thumbnail} className={"w-full h-auto rounded-t"} alt={props.title} />
                        <div className={"p-4"}>
                            <div className={"pb-2 text-white font-semibold tracking-wider w-full truncate"}>
                                {props.title}
                            </div>
                            <div className={"flex"}>
                                <div className={"w-auto mr-auto"}>
                                    <div className={"flex text-sm"}>
                                        <div className={"w-6"}>
                                            <img className="w-full h-auto rounded-full" src={props.avatar} alt={props.name} />
                                        </div>
                                        <div className={"w-auto pl-2 my-auto"}>
                                            <span className={"text-orange-400 tracking-wider"}>
                                                {props.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={"w-auto text-sm text-right text-white"}>
                                    <div className={"text-right"}>
                                        {props.viewers} viewers
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </a>
            </div>
        ) : (
            <a href={`https://twitch.tv/${props.name}`} target={"_blank"} rel="noreferrer" className={"mb-2 block"}>
                <div className={"bg-gray-775 hover:bg-gray-800 transition ease-in-out duration-200 border-l-4 border-purple-500 rounded shadow"}>
                    <div className={"flex p-2"}>
                        <div className={"w-32"}>
                            <img className="w-full h-auto" src={props.thumbnail} alt={props.name} />
                        </div>
                        <div className={"w-full pl-3"}>
                            <div className={"flex text-base"}>
                                <div className={"w-6"}>
                                    <img className="w-full h-auto rounded-full" src={props.avatar} alt={props.name} />
                                </div>
                                <div className={"w-auto pl-2 my-auto"}>
                                    <span className={"text-orange-400 tracking-wider"}>
                                        {props.name}
                                    </span>
                                </div>
                            </div>
                            <div className={"w-auto my-auto text-sm pt-2 text-white"}>
                                <FontAwesomeIcon icon={faCircle} className={"text-red-500 mr-1 pb-px"} /> {props.viewers} viewers
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        )
    )
}

export default Stream;
