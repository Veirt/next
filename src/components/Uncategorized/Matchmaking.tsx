import { useEffect, useState } from 'react';
import { usePlayerContext } from '../../contexts/Player.context';
import Redirect from '../Uncategorized/Redirect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleNotch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const Queue = () => {
  const router = useRouter();

  const { inQueue, setInQueue, queueAccept, queuePending, queueTimer, queueFound, acceptQueue } = usePlayerContext();
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    let redirectInterval: NodeJS.Timeout | null = null;

    if (queuePending && !queueFound) (document.getElementById('MatchFound') as HTMLAudioElement)?.play();

    if (queueFound) {
      if (router.pathname !== '/') setRedirect('/');

      redirectInterval = setTimeout(() => {
        setInQueue(false);
        setRedirect('/game');

        return false;
      }, 5000);
    }
    return () => {
      if (redirectInterval) clearInterval(redirectInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, redirect, queueFound, queuePending]);

  const timerString = new Date(queueTimer * 1000).toISOString().substr(14, 5);

  return (
    <>
      {redirect && redirect !== '' && <Redirect to={redirect} />}
      {inQueue && (
        <div className="fixed top-14 xl:top-0 xl:mt-0 right-0 left-0 z-50">
          <div className="flex justify-center">
            <div
              className={`${
                !queuePending
                  ? 'bg-orange-300 border-orange-500 text-orange-900'
                  : 'bg-green-300 border-green-500 text-green-900'
              } rounded-b-xl shadow-md w-72 px-4 py-2`}
            >
              <div className="flex justify-between">
                <div>
                  <FontAwesomeIcon
                    icon={!queuePending ? faCircleNotch : faCheck}
                    className="mr-2"
                    spin={!queuePending}
                  />
                  {!queuePending ? (
                    <span className="font-semibold">Searching ({timerString})</span>
                  ) : (
                    <span className="font-semibold">{queueFound ? 'Loading Match' : 'Match Found!'}</span>
                  )}
                </div>
                {!queuePending && !queueAccept ? (
                  <button
                    type="button"
                    className="focus:outline-none text-orange-900 hover:opacity-70 transition ease-in-out duration-300"
                    onClick={() => setInQueue(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  </button>
                ) : (
                  !queueAccept && (
                    <button
                      type="button"
                      className={`focus:outline-none my-auto px-2 text-sm rounded-lg border-2 border-green-900 ${
                        !queueAccept
                          ? 'hover:bg-green-900 hover:text-white bg-transparent text-green-900'
                          : 'bg-green-900 text-white'
                      } transition ease-in-out duration-300 mr-2`}
                      onClick={acceptQueue}
                    >
                      Accept
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Queue;
