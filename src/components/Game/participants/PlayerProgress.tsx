import { FC } from 'react';

interface IProps {
    Progress: number;
    Quit: number;
    rounded?: boolean;
}

const PlayerProgress:FC<IProps> = (props) => {
    const { Progress, Quit, rounded } = props;
    return (
        <div className={`bg-gray-825 ${rounded ? 'rounded-lg' : ''}`}>
            {Quit !== 1 ? (
                <div
                    className={`progress-smooth ${Progress === 100 ? 'bg-green-400' : 'bg-blue-400'} bg-opacity-50 ${rounded ? 'rounded-lg' : ''} h-1.25`}
                    style={{ width: `${Progress || 0}%` }}
                />
            ) : ( 
                <div
                    className={`progress-smooth ${Progress !== 100 ? `bg-red-600` : `bg-green-400`} bg-opacity-50 ${rounded ? 'rounded-lg' : ''} h-1.25`}
                    style={{ width: `${Progress || 100}%` }}
                />
            )}
        </div>
    )
}

export default PlayerProgress;