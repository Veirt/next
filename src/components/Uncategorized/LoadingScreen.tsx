import { useEffect, useState } from 'react';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
  isPartial?: boolean;
}

const LoadingScreen = (props: IProps) => {
  const { isPartial } = props;
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={`flex ${isPartial ? 'py-64' : 'h-screen'} transition-all ease-in-out duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className={'m-auto'}>
        <FontAwesomeIcon className="text-3xl text-center text-white text-white" icon={faCircleNotch} spin />
      </div>
    </div>
  );
};

export default LoadingScreen;
