import { useTranslation } from 'next-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  isReconnecting: boolean;
  isConnectionLost: boolean;
}

const MatchToast = (props: IProps) => {
  const { isReconnecting, isConnectionLost } = props;
  const { t } = useTranslation();

  return (
    <>
      {(isReconnecting || isConnectionLost) && (
        <div className="fixed z-50 top-0 left-0 right-0">
          <div className="w-64 pt-20 mx-auto">
            <div className="p-3 bg-blue-500 border-blue-900 rounded border-b-4 text-lg text-center text-white font-semibold tracking-wide">
              <FontAwesomeIcon icon={faCircleNotch} spin className="mr-4" />
              {isReconnecting && t('page.match.reconnect')}
              {isConnectionLost && t('page.match.connect_lost')}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MatchToast;
