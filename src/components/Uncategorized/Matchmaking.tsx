import {useEffect, useState} from 'react';
import {usePlayerContext} from "../../contexts/Player.context";
import Redirect from '../Uncategorized/Redirect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleNotch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const Queue = () => {

    const router = useRouter();

    const { inQueue, setInQueue, queueTimer, queueFound } = usePlayerContext();
    const [ redirect, setRedirect ] = useState('');

    useEffect(() => {
        let redirectInterval: NodeJS.Timeout | null = null;

        if (queueFound) {
            (document.getElementById('MatchFound') as HTMLAudioElement)?.play();
            if (router.pathname !== '/')
                setRedirect('/');

            redirectInterval = setTimeout(() => {
                setInQueue(false);
                setRedirect('/game');

                return false;
            }, 5000);
        }
        return () => {
            if (redirectInterval)
                clearInterval(redirectInterval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ router, redirect, queueFound ]);

    const timerString = new Date(queueTimer * 1000).toISOString().substr(14, 5);

    return (
        <>
            {redirect && redirect !== '' && <Redirect to={redirect} />}
            {inQueue && (
                <div className="fixed top-14 xl:top-0 xl:mt-0 right-0 left-0 z-50">
                    <div className="flex justify-center"> 
                        <div className={`${!queueFound ? 'bg-orange-300 border-orange-500 text-orange-900' : 'bg-green-300 border-green-500 text-green-900'} rounded-b-xl shadow-md w-72 px-4 py-2`}>
                            <div className="flex justify-between">
                                <div>
                                    <FontAwesomeIcon icon={!queueFound ? faCircleNotch : faCheck} className="mr-2" spin={!queueFound} />
                                    {!queueFound 
                                        ? <span className="font-semibold">Searching ({timerString})</span>
                                        : <span className="font-semibold">Match Found</span>
                                    }
                                </div>
                                {!queueFound && (
                                    <button type="button" className="focus:outline-none text-orange-900 hover:opacity-70 transition ease-in-out duration-300" onClick={() => setInQueue(false)}>
                                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Queue;