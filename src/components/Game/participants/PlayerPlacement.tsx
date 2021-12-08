import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";
import {FC} from "react";

interface IProps {
    placement: number;
    placementFinal: number;
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

    const {placement, placementFinal} = props;

    return (
        <>
            {placement !== 0 && (
                <div className="text-base pb-px font-semibold uppercase tracking-wider text-white text-opacity-25">
                    {placement === 1 ? (
                        <FontAwesomeIcon
                            icon={faCrown}
                            className={`mr-2 font-normal ${
                                placementFinal ? 'text-yellow-400' : 'text-white text-opacity-25'
                            }`}
                        />
                    ) : placement !== 999 ? (
                        <span className={placementFinal === 1 ? 'text-white text-opacity-100' : ''}>
                                {numberSuffix(placement || 0)}
                              </span>
                    ) : (
                        ''
                    )}
                </div>
            )}
        </>
    );
};

export default PlayerPlacement;