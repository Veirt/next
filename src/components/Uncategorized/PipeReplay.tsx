import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getKeystrokeLog from "../../utils/getKeystrokeLog";
import { PlayerMatchProfileExtendedData } from "../Leaderboard/LeaderboardPlayerProfile";
import Replay from "./Replay";

interface IProps extends PlayerMatchProfileExtendedData {
    onClose: () => void;
}

const PipeReplay = (props: IProps) => {
    const { playerId, matchId, text, onClose } = props;

    const [ replayLog, setReplayLog ] = useState<string>('');

    useEffect(() => {
        setReplayLog('');

        getKeystrokeLog(playerId, matchId)
            .then((text) => setReplayLog(text))
            .catch((err) => toast.error(err));
    }, [ playerId, matchId ]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50">
            <div className="flex h-screen flex-col justify-center items-center">
                <div className="container-smaller">
                    <div className="content-box">
                        <button type="button" className="absolute top-8 right-8" onClick={() => onClose()}>
                            <FontAwesomeIcon icon={faTimes} />    
                        </button>
                        <Replay logString={replayLog} quote={text[0]?.content || ''}  />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PipeReplay;