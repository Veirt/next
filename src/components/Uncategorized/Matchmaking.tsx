import {useEffect, useState} from 'react';
import {usePlayerContext} from "../../contexts/Player.context";
import Redirect from '../Uncategorized/Redirect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';

const Queue = () => {
    const { inQueue, setInQueue, queueTimer, queueFound } = usePlayerContext();
    const [ redirect, setRedirect ] = useState('');

    useEffect(() => {
        let redirectInterval: NodeJS.Timeout | null = null;

        if (queueFound) {
            (document.getElementById('MatchFound') as HTMLAudioElement).play();
            redirectInterval = setTimeout(() => {
                (document.getElementById('MatchFound') as HTMLAudioElement).play();
                setInQueue(false);
                setRedirect('/game');
            }, 5000);
        }
        return () => {
            if (redirectInterval)
                clearInterval(redirectInterval);
        }
    }, [ redirect, queueFound ]);

    const timerString = new Date(queueTimer * 1000).toISOString().substr(14, 5);

    return (
        <>
            {redirect && redirect !== '' && <Redirect to={redirect} />}
            {inQueue && (
                <div className="fixed top-14 xl:top-16 xl:mt-0 right-0 left-0 z-50">
                    <div className="flex justify-center"> 
                        <div className="rounded-b-xl bg-orange-300 shadow-md border-orange-500 text-orange-900 w-72 px-4 py-2">
                            <div className="flex justify-between">
                                <div>
                                    <FontAwesomeIcon icon={faSpinner} className="mr-2" spin />
                                    <span className="font-semibold">Searching ({timerString})</span>
                                </div>
                                <button type="button" className="focus:outline-none text-orange-900" onClick={() => setInQueue(false)}>
                                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Queue;