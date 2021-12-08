// @ts-nocheck
import {FC} from "react";
import {toggleStaging} from "../../Config";

interface PlaywireProps {
    placementId: string;
    displayNone?: boolean; 
}

const Playwire:FC<PlaywireProps> = (props) => {

    return toggleStaging ? <div id={props.placementId} /> : <></>;
}

export default Playwire;