import { useRef, useState } from "react";

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

    return parsedEvents;
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
    const onIterationCalled = () => {
        const newIteration = (iteration + 1);

        setIteration(newIteration);

        stopInterval(replayInterval.current);
        if (newIteration < parsedReplay.length && parsedReplay[newIteration]) 
            replayInterval.current = setTimeout(onIterationCalled, ((parsedReplay[newIteration]?.delay || 50) / speed));
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
            replayInterval.current = setTimeout(onIterationCalled, (parsedReplay[iteration]?.delay || 50 / speed));
    }

    return (
        <div>
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {parsedReplay.map((item, index) => (
                <>{item.input}-{item.delay}</>
            ))}
        </div>
    )
}

export default Replay;