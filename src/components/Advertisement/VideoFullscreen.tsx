
/*import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Playwire from "./Playwire";
*/
interface IProps {
    toggle: () => void;
}

function VideoFullscreen(props: IProps) {
    console.log(props);
    /*
    const { toggle } = props;
    return (
        <div className={"fixed inset-0 h-screen w-full bg-black bg-opacity-50"} style={{ zIndex: 100 }}>
            <div className="flex h-screen">
                <div className="m-auto relative">
                    <button type="button" className="absolute top-10 right-10 text-4xl text-white hover:text-gray-700 transition ease-in-out duration-300" onClick={toggle}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <Playwire placementId={"60c8c6c97686854babb8c814"} />
                </div>
            </div>
        </div>
    )
    */

    return <></>;
}

export default VideoFullscreen;