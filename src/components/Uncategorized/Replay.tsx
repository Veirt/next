import { faPause, faPlay, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import MatchTextContainer from "../Game/MatchTextContainer";

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
    const { logString, quote } = props;
    const parsedReplay: ReplayData[] = parseReplay(logString);

    // Refs
    const replayInterval = useRef<NodeJS.Timeout | null>(null);

    // States
    const [ state, setState ] = useState<string>('PAUSE');
    const [ iteration, setIteration ] = useState<number>(0);
    const [ speed, setSpeed ] = useState<number>(1);
    const [ mount, setMount ] = useState<boolean>(true);
    const [ elapsed, setElapsed ] = useState<number>(0);

    // Use Effect for Timer
    useEffect(() => {
        const onIterationCalled = () => {
            setIteration(iteration + 1);
            setElapsed((t) => t + (parsedReplay[iteration]?.delay || 50));
        }

        stopIntervalOperation();

        // Refresh
        if (!mount)
            setMount(true);

        // Other
        if (state === 'PLAY') {
            if (parsedReplay.length && iteration < parsedReplay.length)
                replayInterval.current = setTimeout(onIterationCalled, ((parsedReplay[iteration]?.delay || 50) / speed));
        } else if (state === 'RESTART') {
            setIteration(0);
            setMount(false);
            setState('PAUSE');
        }
    }, [ state, iteration, speed, parsedReplay, mount ]);

    // Consts
    const stopInterval = () => setState('PAUSE');
    const playInterval = () => setState('PLAY');
    const resetInterval = () => setState('RESTART');
    const stopIntervalOperation = () => {
        if (replayInterval.current) {
            clearInterval(replayInterval.current);
            replayInterval.current = null;
        }
    }

    return (
        <div>
            <div className="h4">Replay (beta)</div>
            <p className="pt-1 pb-6">
                If you notice any issues, please don't hesitate to report it on GitHub!
            </p>
            <div className="game--content--bar">
                <div className="flex justify-between">
                    <div className="w-auto flex space-x-2">
                        <button type="button" className="button small lightgray" onClick={playInterval}>
                            <FontAwesomeIcon icon={faPlay} />
                        </button>
                        <button type="button" className="button small lightgray" onClick={stopInterval}>
                            <FontAwesomeIcon icon={faPause} />
                        </button>
                        <button type="button" className="button small lightgray" onClick={resetInterval}>
                            <FontAwesomeIcon icon={faRedo} />
                        </button>
                        <div className="hidden">
                            {(iteration / 5) / ((elapsed / 1000) / 60)} - {(elapsed / 1000)}s - {iteration}
                        </div>
                    </div>
                    <div className="w-auto flex space-x-2">
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
            {mount && (
                <div className="pointer-events-none">
                    <MatchTextContainer quote={quote} sendKeystroke={() => false} disabled={false} replayInput={parsedReplay[iteration]?.input || ''} />
                </div>
            )}
        </div>
    )
}

export default Replay;