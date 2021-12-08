import { FC, useEffect } from 'react';
import LoadingScreen from "./LoadingScreen";

interface IProps {
  url: string;
  target?: string;
}

const ExternalRedirect: FC<IProps> = (props) => {
  useEffect(() => {
    if (window)
      window.location.replace(props.url);
  });

  return <LoadingScreen />
}

export default ExternalRedirect;
