import { useRef, useEffect } from "react";
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

    useEffect(() => {
        const handleSceneSwitch = () => {
            if (!afterScene.current || !beforeScene.current || before.Rank === after.Rank)
                return;

            beforeScene.current.style.opacity = '0';
            afterScene.current.style.opacity = '1';
        }

        if (!sceneTimeout.current) 
            sceneTimeout.current = setTimeout(handleSceneSwitch, 3000);

        return () => {
            if (sceneTimeout.current) {
                clearTimeout(sceneTimeout.current);
                sceneTimeout.current = null;
            }
        }
    }, [ before, after ]);

    const renderScene = (data: PlayerCompetitiveData) => {
        return (
            <>
                <img className="w-32 h-32" src={`/ranks/${data.Rank ? `${data.Rank.replaceAll(' ', '').toLowerCase()}` : 'unrated'}.svg`} alt={data.Rank} />
                <div className="text-4xl font-bold mt-4">
                    {data.Rank}
                </div>
                {data.Remaining > 0 ? (
                    <div className="text-sm font-semibold">
                        {data.Remaining} games remaining
                    </div>
                ) : (
                    <div className="text-2xl font-bold mt-1">
                        {data.SR} <span className="text-orange-400">SR</span>
                    </div>
                )}
            </>
        )
    }

    return (
        <div className="relative">
            <div ref={beforeScene} className={"transition ease-in-out duration-300"} style={{ opacity: 100 }}>
                {before.Rank === after.Rank ? renderScene(after) : renderScene(before)}
            </div>
            <div ref={afterScene} className={"absolute inset-0 w-full h-full z-20 transition ease-in-out duration-500"} style={{ opacity: 0 }}>
                {renderScene(after)}
            </div>
        </div>
    )
}

export default Ranked;