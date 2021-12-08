import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { PureComponent } from 'react';

interface IProps {
    timer: number;
    found?: boolean;
    onClick: React.FormEventHandler;
}

class QueueToast extends PureComponent<IProps> {
    render() {
        const { found, timer, onClick } = this.props;

        const timerString = new Date(timer * 1000).toISOString().substr(14, 5);

        return (
            <div className={`fixed z-50 w-full mx-6 lg:mx-auto lg:w-96 top-0 left-0 right-0 lg:mt-14 p-1 lg:p-3.5 shadow-lg rounded-lg ${found ? 'bg-green-400 text-green-900' : 'bg-orange-400 text-orange-900'} text-base text-center text-white uppercase font-semibold tracking-wide`}>
                <div className="flex">
                    <div className="w-auto mr-auto">
                        {!found ? (
                            <>
                                <FontAwesomeIcon icon={faCircleNotch} spin className="mr-3" />
                                Searching for match - {timerString}
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-3" />
                                Match Found
                            </>
                        )}
                    </div>
                    <div className="w-auto px-2 pointer-events-auto">
                        {!found && (
                            <button type="button" onClick={onClick} className={"focus:outline-none hover:opacity-80 transition ease-in-out duration-300"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default QueueToast;
