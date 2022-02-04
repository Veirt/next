import { faPause, faPlay, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import MatchTextContainer from "../Game/MatchTextContainer";
import ItemBanner from "../Inventory/ItemBanner";

interface IProps {
    logString: string;
    quote: string
}

interface ReplayData {
    input: string;
    delay: number;
}

const parseReplay = (logString: string) => {
    const parsedEvents: ReplayData[] = [];
    const listOfEvents = logString.split("»");

    listOfEvents.map((item) => {
        const input = String(item.split("«")[0]);
        const delay = Number(item.split("«")[1]);

        parsedEvents.push({ input, delay });
    });

    return [ { input: '', delay: 0 }, ...parsedEvents ];
};

const Replay = (props: IProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { logString, quote } = props;
    const parsedReplay: ReplayData[] = parseReplay(logString);

    /*
        State Information
        0 - Not Playing
        1 - Playing

        State Iteration = Which iteration of the replay we are on
        State Speed = What speed the iteration is playing at, 1 being regular and 0.25 being 25%

        -- 

        Using `setTimeout` for this functionality. Make it so setTimeout is called for that iteration's delay,
        once that iteration is called after specific MS then update iteration to go to next state and reset timeout and recreate new timeout
    */

    // Refs
    const replayInterval = useRef<NodeJS.Timeout | null>(null);

    // States
    const [ iteration, setIteration ] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ speed, setSpeed ] = useState<number>(1);

    // Consts
    const onIterationCalled = (i: number) => {
        stopInterval(replayInterval.current);
        if (parsedReplay.length && i < parsedReplay.length)
            replayInterval.current = setTimeout(() => onIterationCalled(iteration), ((parsedReplay[i]?.delay || 50) / speed));

        // New Iteration
        setIteration((it) => it + 1);
        console.log('Updated Iteration: ' + (iteration + 1));
    }
    
    const stopInterval = (interval: NodeJS.Timeout | null) => {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const playInterval = () => {
        stopInterval(replayInterval.current);
        if (iteration < parsedReplay.length && parsedReplay[iteration]) 
            replayInterval.current = setTimeout(() => onIterationCalled(iteration), ((parsedReplay[iteration]?.delay || 50) / speed));
    }

    const resetInterval = () => {
        stopInterval(replayInterval.current);
        setIteration(0);
    }

    return (
        <div>
            <div className="game--content--bar">
                <div className="flex justify-between">
                    <div className="w-auto flex space-x-4">
                        <button type="button" className="button small lightgray" onClick={playInterval}>
                            <FontAwesomeIcon icon={faPlay} />
                        </button>
                        <button type="button" className="button small lightgray" onClick={() => stopInterval(replayInterval.current)}>
                            <FontAwesomeIcon icon={faPause} />
                        </button>
                        <button type="button" className="button small lightgray" onClick={resetInterval}>
                            <FontAwesomeIcon icon={faRedo} />
                        </button>
                    </div>
                    <div className="w-auto flex space-x-4">
                        <button type="button" className={`button small ${speed === 1 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(1)}>
                            100%
                        </button>
                        <button type="button" className={`button small ${speed === 0.75 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(0.75)}>
                            75%
                        </button>
                        <button type="button" className={`button small ${speed === 0.5 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(0.5)}>
                            50%
                        </button>
                        <button type="button" className={`button small ${speed === 0.25 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(0.25)}>
                            25%
                        </button>
                    </div>
                </div>
            </div>
            <div className="pointer-events-none">
                <MatchTextContainer quote={quote} sendKeystroke={() => false} disabled={false} replayInput={parsedReplay[iteration]?.input || ''} />
            </div>
        </div>
    )
}

export default Replay;