import { useRef, useEffect } from "react";
import useConfig from "../../../hooks/useConfig";
import { PlayerCompetitiveData } from "../../../types.client.mongo";

interface IProps {
    before: PlayerCompetitiveData;
    after: PlayerCompetitiveData;
}

const Ranked = (props: IProps) => {

    const { before, after } = props;
    const { rankUpSound } = useConfig();

    const beforeScene = useRef<HTMLDivElement | null>(null);
    const afterScene = useRef<HTMLDivElement | null>(null);
    const sceneTimeout = useRef<NodeJS.Timeout | null>(null);

    const rankDownRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const handleSceneSwitch = () => {
            if (!afterScene.current || !beforeScene.current || before.Rank === after.Rank || (before.Rank !== after.Rank && before.SR > after.SR))
                return;

            beforeScene.current.style.opacity = '0';
            afterScene.current.style.opacity = '1';

            if (rankUpSound === '1' && before.SR < after.SR)
                rankDownRef.current?.play();
        }

        if (!sceneTimeout.current) 
            sceneTimeout.current = setTimeout(handleSceneSwitch, 3000);

        return () => {
            if (sceneTimeout.current) {
                clearTimeout(sceneTimeout.current);
                sceneTimeout.current = null;
            }
        }
    }, [ rankUpSound, before, after ]);

    const renderScene = (data: PlayerCompetitiveData) => {
        return (
            <div className="flex flex-col items-center justify-center">
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
            </div>
        )
    }

    return (
        <div className="relative">
            <audio ref={rankDownRef} src="/audio/LevelUp.wav" crossOrigin="anonymous" preload="auto" />
            <div ref={beforeScene} className={"transition ease-in-out duration-300"} style={{ opacity: 100 }}>
                {(before.Rank === after.Rank || (before.Rank !== after.Rank && before.SR > after.SR)) ? renderScene(after) : renderScene(before)}
            </div>
            <div ref={afterScene} className={"absolute inset-0 w-full h-full z-20 transition ease-in-out duration-500"} style={{ opacity: 0 }}>
                {(after.Rank !== before.Rank) && (
                    <div className="absolute top-24 left-0 right-0 flex justify-center mt-2">
                        <div className="w-40">
                            <div className="px-4 py-2 rounded-lg bg-black bg-opacity-80 shadow-sm text-base font-semibold">
                                New Rank!
                            </div>
                        </div>
                    </div>
                )}
                {renderScene(after)}
            </div>
        </div>
    )
}

export default Ranked;