import { FC, useEffect, useRef, useState } from 'react';
import { PlayerChallengeData } from '../../types.client.mongo';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { CancelTokenSource } from 'axios';
import Config from '../../Config';
import { toast } from 'react-toastify';
import useCSRF from '../../hooks/useCSRF';

interface IProps extends PlayerChallengeData {
  mini?: boolean;
}

const Challenge: FC<IProps> = (props) => {
  const { mini, value, challenge, mode, finished } = props;
  const axiosCancelSource = useRef<CancelTokenSource | null>(null);
  const { _csrf } = useCSRF();

  const [redeem, setRedeem] = useState<boolean>(false);

  const redeemChallenges = () => {
    axios
      .post(
        `${Config.apiUrl}/player/redeem`,
        { _csrf },
        { withCredentials: true, cancelToken: axiosCancelSource.current?.token },
      )
      .then((response) => {
        if (!response.data.error) {
          setRedeem(true);
          toast.success('Redeemed!');
        } else toast.error('You have nothing to redeem!');
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    axiosCancelSource.current = axios.CancelToken.source();
    return () => axiosCancelSource.current?.cancel();
  }, []);

  return challenge[0] && mode[0] ? (
    <div>
      {mini ? (
        <div className={`text-left`}>
          <div className={'flex text-white'}>
            <div className={'w-20 text-center my-auto -mr-8 z-20'}>
              <img
                className={'w-full h-auto filter drop-shadow-lg'}
                src={`/challenges/${challenge[0].type}.svg`}
                alt={``}
              />
            </div>
            <div className={'w-full my-auto bg-gray-700 rounded-xl pl-12 py-2 shadow'}>
              <div className={'text-lg font-semibold'}>{mode[0].modeName}</div>
              <div className={'text-sm -mt-0.5 text-gray-400'}>
                {challenge[0].text.split('(')[0]}({challenge[0].text.split('(')[1]}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4 text-left">
          <div className="hidden 3xl:block col-span-full xl:col-span-1 my-auto">
            <img
              src={`/challenges/${challenge[0].type}.svg`}
              alt={challenge[0].text}
              className={'block mx-auto transform scale-110'}
            />
          </div>
          <div className="col-span-full 3xl:col-span-4 my-auto">
            <div className="h4 text-orange-400" style={{ fontWeight: '700' }}>
              {mode[0].modeName}
            </div>
            <p className="pt-1 block text-sm">
              {challenge[0].text.split('(')[0]}
              <div>({challenge[0].text.split('(')[1]}</div>
            </p>
          </div>
          <div className="col-span-full mt-2">
            <div className="flex flex-wrap text-sm">
              <div className={'w-auto py-1.5 px-4 bg-gray-825 text-center rounded-lg mr-2'}>
                <FontAwesomeIcon icon={faCoins} className={'text-yellow-400 mr-1'} />
                {challenge[0].rewards?.currency.toLocaleString()}
              </div>
              <div className={'w-auto py-1.5 px-4 bg-gray-825 text-center rounded-lg mr-auto'}>
                {value > challenge[0].value ? challenge[0].value.toLocaleString() : value.toLocaleString()}
                <span className={'text-white'}>/{challenge[0].value.toLocaleString()}</span>
              </div>
              <button
                type={'button'}
                className={`button small orange ${
                  !finished || finished === 2 || redeem ? 'opacity-50 pointer-events-none' : 'opacity-100'
                } `}
                onClick={redeemChallenges}
              >
                {redeem || finished === 2 ? 'Redeemed' : 'Redeem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export default Challenge;
