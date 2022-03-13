import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
    toggle: () => void;
}

function VideoFullscreen(props: IProps) {

    const { toggle } = props;
    return (
        <div className={"fixed inset-0 h-screen w-full bg-black bg-opacity-50"} style={{ zIndex: 100 }}>
            <div className="flex h-screen">
                <div className="m-auto relative">
                    <button type="button" className="absolute top-10 right-10 text-4xl text-white hover:text-gray-700 transition ease-in-out duration-300" onClick={toggle}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    
                    <div className="pw-in-article-video-container">
                        <div className="pw-in-article-video"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoFullscreen;