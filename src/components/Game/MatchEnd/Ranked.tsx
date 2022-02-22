import { useRef, useEffect, useState } from "react";
import { PlayerCompetitiveData } from "../../../types.client.mongo";

interface IProps {
    before: PlayerCompetitiveData;
    after: PlayerCompetitiveData;
}

const Ranked = (props: IProps) => {

    const { before, after } = props;

    const beforeScene = useRef<HTMLDivElement | null>(null);
    const afterScene = useRef<HTMLDivElement | null>(null);
    const sceneTimeout = useRef<NodeJS.Timeout | null>(null);

    const [ triggerScene, setTriggerScene ] = useState<boolean>(false);

    useEffect(() => {
        console.log('Effect');
    }, [ before, after ]);

    const renderScene = (data: PlayerCompetitiveData) => {
        return (
            <>
                <img className="w-32 h-32" src={`/ranks/${data.Rank ? `${data.Rank.replaceAll(' ', '').toLowerCase()}` : 'unrated'}.svg`} alt={data.Rank} />
                <div className="text-xl font-bold mt-4">
                    {data.Rank}
                </div>
                {data.Remaining <= 0 && (
                    <div className="text-sm font-semibold">
                        {data.Remaining} games remaining
                    </div>
                )}

            </>
        )
    }

    return (
        <div ref={beforeScene} className="relative">
            {renderScene(before)}
            <div ref={afterScene} className={"absolute inset-0 w-full h-full z-20 transition ease-in-out duration-300"} style={{ opacity: 0 }}>
                {renderScene(after)}
            </div>
        </div>
    )
}

export default Ranked;