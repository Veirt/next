import {FC, useState} from 'react';
import DebugService from "../../services/DebugService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import { useTranslation } from 'next-i18next';
import Modal from '../Uncategorized/Modal';

interface IProps {
    onClickOpen: any;
    onClickEnd: any;
}

const MatchBug: FC<IProps> = (props) => {
    const [ overlay, setOverlay ] = useState(0);
    const { t } = useTranslation();

    const debugLog = DebugService.get();
    let debugString = "";

    debugLog.map((item: string) => debugString += `${item}\n`);

    const clickOpen = () => {
        props.onClickOpen();

        setOverlay(overlay + 1);
    }

    const clickCopy = () => {
        setTimeout(() => {
            const getTextarea : any = document.getElementById('copyPasteDebug');
            if (getTextarea) {
                getTextarea.select();
                document.execCommand('copy');
            }
            toast.success('Copied to Clipboard');
        }, 50);
    }

    const clickExit = () => {
        props.onClickEnd();
        setOverlay(overlay - 1);
    }

    return (
        <div>
            <button type={"button"} onClick={clickOpen} className={"absolute bottom-0 left-0 w-16 bg-black bg-opacity-70 hover:bg-black hover:bg-opacity-40 transition ease-in-out duration-300 rounded-t-2xl text-center py-3 ml-4 z-50"}>
                <FontAwesomeIcon icon={faBug} className={"text-2xl text-white text-center mt-1"} />
            </button>
            <Modal isOpened={overlay === 1} onClose={clickExit}>
                <div className={""}>
                    <div className={"text-gray-300"}>
                        <div className={"text-2xl font-semibold tracking-wider text-white"}>{t('other.debug.title')}</div>
                        <div className={"py-2"}>
                            {t('other.debug.message')}
                            <ul className={"pl-8 pt-2 list-disc"}>
                                <li>{t('other.debug.list.0')}</li>
                                <li>{t('other.debug.list.1')}</li>
                                <li>{t('other.debug.list.2')}</li>
                                <li>{t('other.debug.list.3')}</li>
                            </ul>
                        </div>
                    </div>
                    <button type={"button"} className={"btn btn--blue mt-2"} onClick={clickCopy}>Copy to Clipboard</button>
                </div>
                <textarea id={"copyPasteDebug"} rows={10} className={"absolute opacity-0"} defaultValue={debugString} readOnly={true} />
            </Modal>
        </div>
    );
}

export default MatchBug;
