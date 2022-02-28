import { faAngleDoubleRight, faPause, faPlay, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
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
        let triggerFakeEvent = false;

        const input = String(item.split("«")[0]);
        const delay = Number(item.split("«")[1]);

        // Check if Last Keystrokes Match
        const useLastEvent = parsedEvents[parsedEvents.length - 1] || null;
        if (useLastEvent && !useLastEvent?.input.endsWith(' ')) {
            const prevInput = useLastEvent.input;
            const longestInput = prevInput.length > input.length ? 'current' : 'previous';
            const difference = Math.abs(prevInput.length - input.length);
            const useLength = (longestInput === 'current' ? input.length : prevInput.length) - difference;

            let i:number;
            for (i = 0; i < useLength; i++) {
                if (prevInput[i] !== input[i]) {
                    triggerFakeEvent = true;
                    break;
                }
            }

            if (triggerFakeEvent) {
                console.log('BAD INPUT');
                parsedEvents.push({ input: '', delay: 0 });
            }


            /*
            if (
                !useLastEvent?.input.endsWith(' ') && 
                (
                    (useLastEvent.input.length === input.length && useLastEvent?.input.charAt(useLastEvent.input.length - 1) !== input.charAt(input.length - 1)) || 
                    useLastEvent?.input.charAt(0) !== input.charAt(0)
                )
            )  {
                parsedEvents.push({ input: '', delay: 0 });
            }
            */
        }
        console.log(input + '|');

        parsedEvents.push({ input, delay });
    });

    return [ { input: '', delay: 0 }, ...parsedEvents ];
};

const Replay = (props: IProps) => {
    const { logString, quote } = props;
    const parsedReplay = useMemo(() => parseReplay(logString), [logString]);

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
            <ReactTooltip />
            <div className="h4">
                Replay
                <span className="ml-2 -mt-2 bg-gray-700 px-2 py-0.5 text-xs rounded-full">Beta</span>
            </div>
            <button type="button" onClick={() => { toast.success("Copied to clipboard!"); navigator?.clipboard.writeText(logString) }} className="text-sm font-semibold text-orange-400 mt-2 hover:opacity-70 transition ease-in-out duration-300">
                <FontAwesomeIcon icon={faAngleDoubleRight} /> Download Keystroke Log Data (debugging)
            </button>
            <div className="game--content--bar mt-4">
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
                        <div className="flex space-x-4 pl-4 text-xs my-auto" data-tip="These results may be slightly inaccurate from your final speed.">
                            <div className="text-orange-400 font-semibold hidden">
                                {(((iteration / 5) / ((elapsed / 1000) / 60)) || 0).toFixed(2)} WPM
                            </div>
                            <div className="text-orange-400 font-semibold">
                                {iteration}f of {parsedReplay.length}f
                            </div>
                        </div>
                    </div>
                    <div className="w-auto flex space-x-2">
                        <button type="button" style={{ textTransform: 'lowercase' }} className={`button small ${speed === 2 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(2)}>
                            2x
                        </button>
                        <button type="button" style={{ textTransform: 'lowercase' }} className={`button small ${speed === 1.5 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(1.5)}>
                            1.5x
                        </button>
                        <button type="button" style={{ textTransform: 'lowercase' }} className={`button small ${speed === 1 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(1)}>
                            1x
                        </button>
                        <button type="button" style={{ textTransform: 'lowercase' }} className={`button small ${speed === 0.75 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(0.75)}>
                            3/4x
                        </button>
                        <button type="button" style={{ textTransform: 'lowercase' }} className={`button small ${speed === 0.5 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(0.5)}>
                            1/2x
                        </button>
                        <button type="button" style={{ textTransform: 'lowercase' }} className={`button small ${speed === 0.25 ? 'gray' : 'lightgray'} text-xs`} onClick={() => setSpeed(0.25)}>
                            1/4x
                        </button>
                    </div>
                </div>
            </div>
            <div className={"pointer-events-none h-68"}>
                <MatchTextContainer quote={mount ? quote : 'Refreshing...'} sendKeystroke={() => false} disabled={false} replayInput={parsedReplay[iteration]?.input || ''} isReplay />
            </div>
        </div>
    )
}

export default Replay;