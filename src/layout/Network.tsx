import { usePlayerContext } from '../contexts/Player.context';
import { useRouter } from 'next/router';
import { faSignal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Network = () => {
  const { pingLatency, packetLoss } = usePlayerContext();

  const router = useRouter();

  return !router.asPath.includes('/game') && !router.asPath.includes('/warmup') ? (
    <div className="fixed z-20 bottom-0 right-4 hidden 3xl:block">
      <div className="py-1 text-sm font-semibold bg-black bg-opacity-30 px-4 flex text-left justify-end rounded-t-xl">
        <div className="w-6">
          <FontAwesomeIcon
            icon={faSignal}
            className={`
                        mr-0.5
                        ${packetLoss <= 10 && 'text-green-500'}
                        ${packetLoss > 10 && packetLoss <= 30 && 'text-yellow-500'}
                        ${packetLoss > 30 && packetLoss <= 100 && 'text-red-500'}
                        transition ease-in-out duration-300
                    `}
          />
        </div>
        <div className="w-10">{pingLatency}ms</div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Network;
