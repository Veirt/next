import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";
import {FC, useState} from "react";
import Modal from "../../Uncategorized/Modal";
import Replay from "../../Uncategorized/Replay";

interface IProps {
    placement: number;
    placementFinal: number;
    replay?: string;
    replayText?: string;
}

const PlayerPlacement:FC<IProps> = (props) => {

    const numberSuffix = (i: number): string => {
        const j = i % 10;
        const k = i % 100;
        if (j === 1 && k !== 11) return `${i}st`;
        if (j === 2 && k !== 12) return `${i}nd`;
        if (j === 3 && k !== 13) return `${i}rd`;
        return `${i}th`;
    };

    const {placement, placementFinal, replay, replayText} = props;

    const [ modal, setModal ] = useState<boolean>(false);

    return (
        <>
            {(replayText && replay) && (
                <Modal isOpened={modal} onClose={() => setModal(false)}>
                    <div className="text-left">
                        <Replay logString={replay || ''} quote={replayText} />
                    </div>
                    
                </Modal>
            )}
            <button type="button" onClick={() => setModal(true)} className={`focus:outline-none hover:opacity-70 transition ease-in-out duration-300 ${!replay ? 'pointer-events-none' : ''}`}>
                {placement !== 0 && (
                    <div className="text-base pb-px font-semibold uppercase tracking-wider text-white text-opacity-25">
                        {placement === 1 ? (
                            <FontAwesomeIcon
                                icon={faCrown}
                                data-tip={placementFinal ? `You have placed ${numberSuffix(placement || 0)}!` : `Placements are not final until all players have completed due to our FKD system.`}
                                className={`mr-2 font-normal ${
                                    placementFinal ? 'text-yellow-400' : 'text-white text-opacity-25'
                                }`}
                            />
                        ) : placement !== 999 ? (
                            <span className={placementFinal === 1 ? 'text-white text-opacity-100' : ''} data-tip={placementFinal ? `You have placed ${numberSuffix(placement || 0)}!` : `Placements are not final until all players have completed due to our FKD system.`}>
                                {numberSuffix(placement || 0)}
                            </span>
                        ) : (
                            ''
                        )}
                    </div>
                )}
            </button>
        </>
    );
};

export default PlayerPlacement;