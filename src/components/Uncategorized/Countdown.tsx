import { useCallback, useEffect, useRef, useState } from 'react';

interface IProps {
  minuteSeconds: number;
  onCountdownFinish: () => void;
}

const Countdown = (props: IProps) => {
  const countdownTimer = useRef<NodeJS.Timer | null>(null);
  const [countdown, setCountdown] = useState(-1);
  const { minuteSeconds, onCountdownFinish } = props;

  const setupCountdown = useCallback(() => {
    const useSeconds = minuteSeconds + 2;
    const getSeconds = new Date().getSeconds();

    setCountdown(useSeconds - getSeconds);
  }, [minuteSeconds]);

  const updateCountdown = () => setCountdown((countdown) => countdown - 1);

  useEffect(() => {
    setupCountdown();
    countdownTimer.current = setInterval(() => updateCountdown(), 1000);
    return () => {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
        countdownTimer.current = null;
      }
    };
  }, [setupCountdown]);

  useEffect(() => {
    if (countdown === 0) {
      setupCountdown();
      onCountdownFinish();
    }
  }, [setupCountdown, onCountdownFinish, countdown]);

  const formatCountdown = (countdown: number) => new Date(countdown * 1000).toISOString().substr(14, 5);

  return <div className={'pt-2 text-white font-semibold uppercase text-xs'}>Updating in {formatCountdown(countdown)}</div>;
};

export default Countdown;
