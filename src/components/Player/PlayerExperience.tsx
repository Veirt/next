import { FC } from 'react';

interface UserExperienceProps {
    experience: number;
    level: number;
    next: number;
    prev?: number;
    percentage: number;
    size?: number;
}

const PlayerExperience: FC<UserExperienceProps> = (props) => {
    const { percentage, size } = props;
    let heightClass = "h-1";
    if (size)
        heightClass = "h-2";

    return (
        <div>
            <div className={`${heightClass} w-full bg-gray-700 bg-opacity-75 rounded-full`}>
                <div className={`${heightClass} bg-orange-400 bg-opacity-75 font-semibold rounded-full`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

export default PlayerExperience;
