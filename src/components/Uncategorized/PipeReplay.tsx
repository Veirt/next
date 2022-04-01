import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getKeystrokeLog from "../../utils/getKeystrokeLog";
import { PlayerMatchProfileExtendedData } from "../Leaderboard/LeaderboardPlayerProfile";
import Replay from "./Replay";

interface IProps extends PlayerMatchProfileExtendedData {
    onClose: () => void;
    isModal?: boolean;
}

const PipeReplay = (props: IProps) => {
    const { playerId, matchId, created, isModal, onClose } = props;

    const [ replayLog, setReplayLog ] = useState<string>('');
    const [ replayQuote, setReplayQuote ] = useState<string>('');

    useEffect(() => {
        setReplayLog('');

        getKeystrokeLog(playerId, matchId)
            .then((text) => {
                const parseLog = text.split('<&>');
                setReplayQuote(parseLog[0] || '');
                setReplayLog(parseLog[1] || '');
            })
            .catch((err) => toast.error(err));
    }, [ playerId, matchId ]);

    const getNet90 = (date: number) => date + (90 * 86400);

    return (
        <div className={isModal ? "fixed inset-0 bg-black bg-opacity-50" : ""}>
            <div className={isModal ? "flex h-screen flex-col justify-center items-center" : ""}>
                <div className={isModal ? "container-smaller" : ""}>
                    <div className="content-box">
                        {isModal && (
                            <button type="button" className="absolute top-8 right-8" onClick={() => onClose()}>
                                <FontAwesomeIcon icon={faTimes} />    
                            </button>
                        )}
                        <div className="absolute top-16 right-8">
                            Expires {moment.unix(getNet90(created)).fromNow()}
                        </div>
                        <Replay logString={replayLog} quote={replayQuote}  />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PipeReplay;
