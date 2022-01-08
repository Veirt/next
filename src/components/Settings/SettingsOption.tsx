import {useTranslation} from "next-i18next";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface IProps {
    title: string;
    name: string;
    value: string | number | any;
    onChange: (e: string | number | any) => void;
    type: 'string' | 'textarea' | 'configBoolean' | 'configMatchText' | 'configScale' | 'configPlayercardList' | 'configWPM' | 'configShortcut' | 'selectKeyboard' | 'selectCountry' | 'selectWorld' | 'selectLocale' | 'selectSmoothCaretSpeed';
    worldList?: { id: number, name: string }[];
    localeList?: { name: string, locale: string }[];
    keyboardList?: { id: number, name: string }[];
    countryList?: { name: string, code: string }[];
    smoothCaretList?: { id: string, name: string }[];
}

const SettingsOption = (props: IProps) => {

    const { title, name, value, onChange, type, worldList, localeList, keyboardList, smoothCaretList, countryList } = props;
    const { t } = useTranslation();

    return (
        <>
            {(type === 'selectLocale' && localeList) ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2"}>
                        <select className={"input-settings"} onChange={(e) => onChange(e.target.value)}>
                            {localeList.map((item) => <option key={item.name} value={item.locale} selected={item.locale === value}>{item.name}</option>)}
                        </select>
                    </div>
                </div>
            ) : (type === 'selectCountry' && countryList) ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2"}>
                        <select className={"input-settings"} onChange={(e) => onChange(e.target.value)}>
                            {countryList.map((item, index) => <option key={index} value={index} selected={index === value}>{item.name}</option>)}
                        </select>
                    </div>
                </div>
            ) : (type === 'selectWorld' && worldList) ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2"}>
                        <select className={"input-settings"} onChange={(e) => onChange(e.target.value)}>
                            {worldList.map((item, index) => <option key={index} value={item.id} selected={item.id === value}>{item.name}</option>)}
                        </select>
                    </div>
                </div>
            ) : (type === 'selectSmoothCaretSpeed' && smoothCaretList) ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2"}>
                        <select className={"input-settings"} onChange={(e) => onChange(e.target.value)}>
                            {smoothCaretList.map((item, index) => <option key={index} value={item.id} selected={item.id === value}>{item.name}</option>)}
                        </select>
                    </div>
                </div>
            ) : (type === 'selectKeyboard' && keyboardList) ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2"}>
                        <select className={"input-settings"} onChange={(e) => onChange(e.target.value)}>
                            {keyboardList.map((item, index) => <option key={index} value={item.id} selected={item.id === value}>{item.name}</option>)}
                        </select>
                    </div>
                </div>
            ) : type === 'string' ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2"}>
                        <input type={"text"} onChange={(e) => onChange(e.target.value)} name={name} className={"input-settings"} value={value || ''} required />
                    </div>
                </div>
            ) : type === 'textarea' ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2"}>
                        <textarea onChange={(e) => onChange(e.target.value)} name={name} className={"col-span-full input-settings"} value={value || ''} />
                    </div>
                </div>
            ) : type === 'configBoolean' ? (
                <div className={"flex"}>
                    <div className={"w-3/4 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/4 flex justify-end"}>
                        <button type={"button"} onClick={() => onChange('1')} className={`w-10 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '1' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button type={"button"} onClick={() => onChange('0')} className={`w-10 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '0' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
            ): type === 'configMatchText' ? (
                <div className={"flex"}>
                    <div className={"w-3/4 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/4 flex justify-end"}>
                        <button type={"button"} onClick={() => onChange('1')} className={`w-16 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '1' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            Mono
                        </button>
                        <button type={"button"} onClick={() => onChange('0')} className={`w-16 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '0' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            Sans
                        </button>
                    </div>
                </div>
            ) : type === 'configScale' ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2 flex justify-end"}>
                        <button type={"button"} onClick={() => onChange('1')} className={`w-16 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '1' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            Large
                        </button>
                        <button type={"button"} onClick={() => onChange('0')} className={`w-16 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '0' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            Normal
                        </button>
                    </div>
                </div>
            ) : type === 'configPlayercardList' ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2 flex justify-end"}>
                        <button type={"button"} onClick={() => onChange('0')} className={`w-20 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '0' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            Default
                        </button>
                        <button type={"button"} onClick={() => onChange('1')} className={`w-16 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '1' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            List
                        </button>
                        <button type={"button"} onClick={() => onChange('2')} className={`w-16 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '2' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            Legacy
                        </button>
                    </div>
                </div>
            ) : type === 'configWPM' ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2 flex justify-end"}>
                        <button type={"button"} onClick={() => onChange('1')} className={`w-14 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '1' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            CPM
                        </button>
                        <button type={"button"} onClick={() => onChange('0')} className={`w-14 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${value === '0' ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            WPM
                        </button>
                    </div>
                </div>
            ) : type === 'configShortcut' ? (
                <div className={"flex"}>
                    <div className={"w-1/2 mr-auto pt-1"}>
                        <div className={"text-base uppercase font-semibold"}>{t(title)}</div>
                    </div>
                    <div className={"w-1/2"}>
                        <input type={"text"} onChange={(e) => onChange(e.target.value)} name={name} className={"input-settings"} placeholder="ie: CTRL+ALT+H" value={value || ''} required />
                    </div>
                </div>
            ) : <></>}
        </>
    )
}

export default SettingsOption;