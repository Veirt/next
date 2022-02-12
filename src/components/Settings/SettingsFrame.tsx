import {Fragment, useEffect, useRef, useState} from 'react';
import {
    faCheck,
    faExclamationCircle,
    faImage,
    faLayerGroup,
    faPortrait,
    faSlidersH,
    faTimes, 
    faTimesCircle,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useConfig, {ConfigData} from "../../hooks/useConfig";
import {useTranslation} from "next-i18next";
import SettingsOption from "./SettingsOption";
import useCSRF from "../../hooks/useCSRF";
import axios, {CancelTokenSource} from "axios";
import Config from '../../Config';
import {toast} from "react-toastify";
import {ItemData} from "../../types.client.mongo";
import ItemPlayercard from "../Inventory/ItemPlayercard";
import ItemBorder from "../Inventory/ItemBorder";
import ItemBanner from "../Inventory/ItemBanner";
import {usePlayerContext} from "../../contexts/Player.context";

interface IProps {
    isVisible?: boolean;
    onClose?: () => void;
}

const SettingsFrame = (props: IProps) => {
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    const { isVisible, onClose } = props;

    const [ tab, setTab ] = useState<number>(0);
    const { setSessionData } = usePlayerContext();
    const { fullConfig } = useConfig();
    const { _csrf } = useCSRF();
    const { t } = useTranslation();
    const [ unsaved, setUnsaved ] = useState<boolean>(false);

    // Player
    const [ name, setName ] = useState<string>('');
    const [ fullName, setFullName ] = useState<string>('');
    const [ country, setCountry ] = useState<number>(0);
    const [ description, setDescription ] = useState<string>('');
    const [ keyboardBrand, setKeyboardBrand ] = useState<string>('');
    const [ keyboardLayout, setKeyboardLayout ] = useState<number>(0);
    const [ keyboardModel, setKeyboardModel ] = useState<string>('');
    const [ cardImage, setCardImage ] = useState<string>('');
    const [ cardBorder, setCardBorder ] = useState<string>('');
    const [ banner, setBanner ] = useState<string>('');
    const [ apiKey, setApiKey ] = useState<string>('');
    const [ inventory, setInventory ] = useState<string[]>([]);

    // Config Settings
    const [ config, setConfig ] = useState<ConfigData>({ ...fullConfig });

    // Data
    const [ playercardList, setPlayercardList ] = useState<ItemData[]>([]);
    const [ borderList, setBorderList ] = useState<ItemData[]>([]);
    const [ bannerList, setBannerList ] = useState<ItemData[]>([]);
    const [ countryList, setCountryList ] = useState<{ name: string, code: string }[]>([]);
    const [ keyboardList, setKeyboardList ] = useState<{ id: number, name: string }[]>([]);
    const [ localeList, setLocaleList ] = useState<{ name: string, locale: string }[]>([]);
    const [ worldList, setWorldList ] = useState<{ id: number, name: string }[]>([]);

    // Deletion
    const [ deletionModel, setDeletionModel ] = useState<boolean>(false);
    const [ deletionText, setDeletionText ] = useState<string>('');

    // API Key
    const [ toggleSecret, setToggleSecret ] = useState<boolean>(false);

    const tabs = [
        { name: 'Account', icon: faUser, tab: 0 },
        { name: 'Config', icon: faSlidersH, tab: 1 },
        { name: 'Playercards', icon: faLayerGroup, tab: 2 },
        { name: 'Borders', icon: faPortrait, tab: 3 },
        { name: 'Banners', icon: faImage, tab: 4 },
        { name: 'Danger Zone', icon: faExclamationCircle, tab: 5 },
    ];

    const smoothCaretList = [
        { id: '75', name: 'Faster' },
        { id: '100', name: 'Normal' },
        { id: '125', name: 'Slow' },
    ];

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();

        axios.get(`${Config.gameUrl}/all`, { cancelToken: axiosCancelSource.current?.token })
            .then((response) => {
                if (!response.data.error) {
                    setPlayercardList(response.data.playercards);
                    setBorderList(response.data.borders);
                    setBannerList(response.data.banners);
                    setKeyboardList(response.data.keyboards);
                    setWorldList(response.data.worlds);
                    setLocaleList(response.data.locales);
                    setCountryList(response.data.countries);
                } else
                    toast.error(response.data.error);
            })

        axios.get(`${Config.apiUrl}/player/info`, { cancelToken: axiosCancelSource.current?.token, withCredentials: true })
            .then((response) => {
                if (!response.data.error) {
                    setName(response.data.name);
                    setFullName(response.data.fullName);
                    setCountry(response.data.countryId);
                    setDescription(response.data.description);
                    setKeyboardBrand(response.data.keyboardBrand);
                    setKeyboardModel(response.data.keyboardModel);
                    setKeyboardLayout(response.data.keyboardId);
                    setCardImage(response.data.cardImage);
                    setCardBorder(response.data.cardBorder);
                    setBanner(response.data.banner);
                    setApiKey(response.data.apiKey);
                } else
                    console.error(response.data.error);
            })

        axios.get(`${Config.apiUrl}/player/inventory`, { cancelToken: axiosCancelSource.current?.token, withCredentials: true })
            .then((response) => {
                if (!response.data.error) {
                    response.data.map((item: { itemId: string }) => setInventory((inventory) => {
                        inventory.push(item.itemId);
                        return [ ...inventory ];
                    }))
                } else
                    toast.error(response.data.error);
            })

        return () => axiosCancelSource.current?.cancel();
    }, [ isVisible ]);

    const handleDelete = () => {
        axios.post(`${Config.apiUrl}/player/delete`, { _csrf }, { cancelToken: axiosCancelSource.current?.token, withCredentials: true })
            .then((response) => {
                if (!response.data.error) {
                    setSessionData(null);
                    return window.location.href = '/';
                } else
                    return toast.error(response.data.error);
            })
            .catch(() => toast.error("Unexpected error occurred!"));
    }

    const handleApiKey = () => {
        const formData = { _csrf };

        axios.post(`${Config.apiUrl}/player/apiKey`, formData, { cancelToken: axiosCancelSource.current?.token, withCredentials: true })
            .then((response) => {
                if (!response.data.error) {
                    setApiKey(response.data.apiKey);
                } else
                    toast.error(response.data.error);
            })
            .catch(() => toast.error("Unexpected error occurred!"));
    }

    const handleSave = () => {
        const formData = { _csrf, ...config, name, fullName, country, description, keyboardLayout, keyboardBrand, keyboardModel, cardImage, cardBorder, banner };

        axios.post(`${Config.apiUrl}/player/settings`, formData, { cancelToken: axiosCancelSource.current?.token, withCredentials: true })
            .then((response) => {
                if (!response.data.error) {
                    setUnsaved(false);
                    return window.location.reload();
                } else
                    toast.error(response.data.error);
            })
            .catch(() => toast.error("Unexpected error occurred!"));
    }

    const options = [
        {
            form: [
                {
                    title: 'page.profile.personal',
                    options: [
                        { title: 'page.profile.displayname', name: 'displayName', value: name, onChange: (v: string) => { setUnsaved(true);  setName(v) }, type: 'string' },
                        { title: 'page.profile.fullname', name: 'fullName', value: fullName, onChange: (v: string) => { setUnsaved(true);  setFullName(v) }, type: 'string' },
                        { title: 'page.profile.country', name: 'countryId', value: country, onChange: (v: number) => { setUnsaved(true);  setCountry(v) }, type: 'selectCountry', countryList },
                        { title: 'page.profile.about', name: 'description', value: description, onChange: (v: string) => { setUnsaved(true);  setDescription(v) }, type: 'textarea' },
                    ]
                },
                {
                    title: 'page.profile.keyboard.title',
                    options: [
                        { title: 'page.profile.keyboard.layout', name: 'keyboardLayout', value: keyboardLayout, onChange: (v: number) => { setUnsaved(true);  setKeyboardLayout(v) }, type: 'selectKeyboard', keyboardList },
                        { title: 'page.profile.keyboard.brand', name: 'keyboardBrand', value: keyboardBrand, onChange: (v: string) => { setUnsaved(true);  setKeyboardBrand(v) }, type: 'string' },
                        { title: 'page.profile.keyboard.model', name: 'keyboardModel', value: keyboardModel, onChange: (v: string) => { setUnsaved(true);  setKeyboardModel(v) }, type: 'string' }
                    ]
                }
            ]
        },
        {
            form: [
                {
                    title: 'page.profile.general',
                    options: [
                        { title: 'page.profile.locale', name: 'locale', value: config.locale, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, locale: String(v) }) }, type: 'selectLocale', localeList },
                        { title: 'page.profile.defaultworld', name: 'defaultWorld', value: config.world, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, world: Number(v) }) }, type: 'selectWorld', worldList },
                        { title: 'page.profile.streamerMode', name: 'streamerMode', value: config.streamerMode, onChange: (v: number) => { setUnsaved(true);  setConfig({ ...config, streamerMode: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.wpm', name: 'useCPM', value: config.useCPM, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, useCPM: String(v) as '0' | '1' }) }, type: 'configWPM' },
                    ]
                },
                {
                    title: 'page.profile.gameplay',
                    options: [
                        { title: 'page.profile.matchTextSize', name: 'upscaleMatch', value: config.upscaleMatch, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, upscaleMatch: String(v) as '0' | '1' }) }, type: 'configScale' },
                        { title: 'page.profile.matchTextType', name: 'matchTextType', value: config.matchTextType, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, matchTextType: String(v) as '0' | '1' }) }, type: 'configMatchText' },
                        { title: 'page.profile.upscaleMatchContainer', name: 'upscaleMatchContainer', value: config.upscaleMatchContainer, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, upscaleMatchContainer: String(v) as '0' | '1' }) }, type: 'configScale' },
                        { title: 'page.profile.matchContainerTransparent', name: 'matchContainerTransparent', value: config.matchContainerTransparent, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, matchContainerTransparent: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.gameplayParticipantStyle', name: 'gameplayParticipantStyle', value: config.gameplayParticipantStyle, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, gameplayParticipantStyle: String(v) as '0' | '1' }) }, type: 'configPlayercardList' },
                        { title: 'page.profile.inputbox', name: 'hideInputBox', value: config.hideInputBox, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, hideInputBox: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.smoothCaret', name: 'smoothCaret', value: config.smoothCaret, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, smoothCaret: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.smoothCaretSpeed', name: 'smoothCaretSpeed', value: config.smoothCaretSpeed, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, smoothCaretSpeed: String(v) as '0' | '1' }) }, type: 'selectSmoothCaretSpeed', smoothCaretList },
                        { title: 'page.profile.hideWPM', name: 'hideWPM', value: config.hideWPM, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, hideWPM: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.focusMode', name: 'focusMode', value: config.focusMode, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, focusMode: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.performanceMode', name: 'performanceMode', value: config.performanceMode, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, performanceMode: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.colorBlindMode', name: 'colorBlindMode', value: config.colorBlindMode, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, colorBlindMode: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.adsGameplay', name: 'adsGameplay', value: config.adsGameplay, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, adsGameplay: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                    ]
                },
                {
                    title: 'page.profile.sound',
                    options: [
                        { title: 'page.profile.countdownBeep', name: 'countdownBeep', value: config.countdownBeep, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, countdownBeep: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.matchFinishBeep', name: 'matchFinishBeep', value: config.matchFinishBeep, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, matchFinishBeep: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.customChatBeep', name: 'customChatBeep', value: config.customChatBeep, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, customChatBeep: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.rankUpSound', name: 'rankUpSound', value: config.rankUpSound, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, rankUpSound: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                        { title: 'page.profile.rankDownSound', name: 'rankDownSound', value: config.rankDownSound, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, rankDownSound: String(v) as '0' | '1' }) }, type: 'configBoolean' },
                    ]
                },
                {
                    title: 'page.profile.shortcuts',
                    options: [
                        { title: 'page.profile.shortcutHome', name: 'shortcutHome', value: config.shortcutHome, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, shortcutHome: String(v) as '0' | '1' }) }, type: 'configShortcut' },
                        { title: 'page.profile.shortcutPlayQuotes', name: 'shortcutPlayQuotes', value: config.shortcutPlayQuotes, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, shortcutPlayQuotes: String(v) as '0' | '1' }) }, type: 'configShortcut' },
                        { title: 'page.profile.shortcutGameRedo', name: 'shortcutGameRedo', value: config.shortcutGameRedo, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, shortcutGameRedo: String(v) as '0' | '1' }) }, type: 'configShortcut' },
                        { title: 'page.profile.shortcutPlayRandom', name: 'shortcutPlayRandom', value: config.shortcutPlayRandom, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, shortcutPlayRandom: String(v) as '0' | '1' }) }, type: 'configShortcut' },
                        { title: 'page.profile.shortcutExit', name: 'shortcutExit', value: config.shortcutExit, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, shortcutExit: String(v) as '0' | '1' }) }, type: 'configShortcut' },
                        { title: 'page.profile.shortcutPlayDictionary', name: 'shortcutPlayDictionary', value: config.shortcutPlayDictionary, onChange: (v: string) => { setUnsaved(true);  setConfig({ ...config, shortcutPlayDictionary: String(v) as '0' | '1' }) }, type: 'configShortcut' },

                    ]
                }
            ]
        }
    ];

    return (
        <>
            <div className={`fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-70 flex w-screen h-screen z-50 ${isVisible ? 'visible opacity-100' : 'invisible opacity-0'}  transition-all ease-in-out duration-300`}>
                <div className={`m-auto max-w-screen-lg w-full ${isVisible ? 'translate-y-0' : 'translate-y-2'} transition-all ease-in-out duration-300`}>
                    <div className={"relative mx-5"}>
                        <button type={"button"} onClick={onClose} className={"focus:outline-none top-0 right-0 mr-2 absolute text-2xl text-gray-400 hover:text-gray-600 transition ease-in-out duration-300"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <div className={"bg-gray-750 text-white shadow-lg rounded-t-2xl"}>
                            <div className={"flex flex-wrap justify-start bg-gray-800 rounded-t-2xl"}>
                                {tabs.map((item) => (
                                    <button key={item.tab} type={"button"} onClick={() => setTab(item.tab)} className={`rounded-t-lg w-auto px-6 py-1.5 sm:py-2 focus:outline-none block text-center text-sm ${tab === item.tab ? 'text-orange-400 bg-gray-750' : 'text-white bg-gray-800 hover:bg-gray-775'} text-base uppercase font-semibold`}>
                                        <FontAwesomeIcon icon={item.icon} className={"lg:mr-2"} />
                                        <span className="hidden lg:inline">{item.name}</span>
                                    </button>
                                ))}
                            </div>
                            {unsaved && (
                                <div className={"absolute flex justify-center gap-2 top-0 mt-12 z-50 left-0 right-0 w-full text-center p-1.5 bg-red-700 bg-opacity-50 text-white"}>
                                    <div className={"my-auto"}>
                                        <strong>Unsaved!</strong> This page will refresh upon saving your changes.
                                    </div>
                                    <button type={"button"} onClick={handleSave} className={"focus:outline-none border border-white rounded px-1 py-0 text-base hover:bg-white hover:text-gray-900 transition ease-in-out duration-300"}>
                                        Save now
                                    </button>
                                </div>
                            )}
                            <div className={"relative p-5 overflow-y-scroll"} style={{ height: '60vh' }}>
                                {tabs.map((_useTab, index: number) => (tab <= 1 && tab === index) && (
                                    <Fragment key={index}>
                                        {/* @ts-ignore */}
                                        {options[index].form.map((item) => (
                                            <div key={item.title} className={"mb-6"}>
                                                <h3 className={"uppercase text-white p-2 text-sm uppercase font-semibold bg-gray-700 mb-3 rounded-lg"}>{t(item.title)}</h3>
                                                <div className={"grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4"}>
                                                    {/* @ts-ignore */}
                                                    {item.options.map((option) => <SettingsOption key={option.title} type={option.type} select={option.data} {...option} />)}
                                                </div>
                                            </div>
                                        ))}
                                    </Fragment>
                                ))}

                                {tab === 0 && (
                                    <div className={"mb-6"}>
                                        <h3 className={"uppercase text-white p-2 text-sm uppercase font-semibold bg-gray-700 mb-3 rounded-lg"}>Developers (coming soon)</h3>
                                        <div className={"flex w-48"}>
                                            <div className={"w-auto my-auto font-semibold mr-2"}>
                                                Show API Key
                                            </div>
                                            <button type={"button"} onClick={() => setToggleSecret(true)} className={`w-10 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${toggleSecret ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                            <button type={"button"} onClick={() => setToggleSecret(false)} className={`w-10 text-center py-1.5 focus:outline-none transition ease-in-out duration-300 ${!toggleSecret ? 'bg-orange-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>
                                        {toggleSecret ? (
                                            <div className={"mt-4"}>
                                                <div className={"inline my-2 rounded-lg bg-gray-825 px-4 py-1.5 text-white"}>
                                                    {apiKey}
                                                </div>

                                                <div className={"mt-3"}>
                                                    <button type={"button"} onClick={handleApiKey} className={"button small orange"}>{apiKey ? 'Generate New Secret' : 'Generate Secret'}</button>
                                                </div>
                                            </div>
                                        ) : <></>}
                                    </div>
                                )}

                                {tab === 2 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {playercardList.map((item) => (inventory.includes(item.file)) && (
                                            <label key={item.file}>
                                                <input type={"radio"} className={"form-control-radio-div"} name={"cardImage"} value={item.file} onChange={e => { setUnsaved(true); setCardImage(e.target.value) }} defaultChecked={cardImage === item.file} />
                                                <div className={"relative h-40 flex bg-gray-700 rounded-lg"}>
                                                    <div className={"w-3/5 m-auto h-auto transition ease-in-out duration-300 hover:transform hover:scale-110"}>
                                                        <ItemPlayercard file={item.file} />
                                                    </div>
                                                    <div className={"text-center font-semibold absolute w-full left-0 right-0 bottom-0 py-2 text-sm uppercase text-white"}>{item.name}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {tab === 3 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {borderList.map((item) => (inventory.includes(item.file)) && (
                                            <label key={item.file}>
                                                <input type={"radio"} className={"form-control-radio-div"} name={"cardBorder"} value={item.file} onChange={e => { setUnsaved(true); setCardBorder(e.target.value) }} defaultChecked={cardBorder === item.file} />
                                                <div className={"relative h-40 flex bg-gray-700 rounded-lg"}>
                                                    <div className={"w-3/5 m-auto h-auto transition ease-in-out duration-300 hover:transform hover:scale-110"}>
                                                        <ItemBorder file={item.file} />
                                                    </div>
                                                    <div className={"text-center font-semibold absolute w-full left-0 right-0 bottom-0 py-2 text-sm uppercase text-white"}>{item.name}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {tab === 4 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {bannerList.map((item) => (inventory.includes(item.file)) && (
                                            <label key={item.file}>
                                                <input type={"radio"} className={"form-control-radio-div"} name={"banner"} value={item.file} onChange={e => { setUnsaved(true); setBanner(e.target.value) }} defaultChecked={banner === item.file} />
                                                <div className={"relative h-40 flex bg-gray-700 rounded-lg"}>
                                                    <div className={"w-3/5 m-auto h-auto transition ease-in-out duration-300 hover:transform hover:scale-110"}>
                                                        <ItemBanner file={item.file} />
                                                    </div>
                                                    <div className={"text-center font-semibold absolute w-full left-0 right-0 bottom-0 py-2 text-sm uppercase text-white"}>{item.name}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {tab === 5 && (
                                    <>
                                        <h3 className={"uppercase text-white p-2 text-sm uppercase font-semibold bg-red-700 bg-opacity-30 mb-3"}>Danger Zone</h3>
                                        <div className={"grid grid-cols-1 md:grid-cols-2 gap-6"}>
                                            <div className={"p-6 bg-gray-775 rounded-lg"}>
                                                <h4>Your Data</h4>
                                                <p className={"pt-1 pb-6 text-sm"}>
                                                    Click the button below to see all of the Data that has ever been stored on Keymash.
                                                </p>
                                                <div className="flex">
                                                    <a target={"_blank"} rel={"noopener noreferrer"} href={`${Config.apiUrl}/player/gdpr`} className={"button small blue"}>
                                                        Raw JSON
                                                    </a>
                                                </div>
                                                
                                            </div>
                                            <div className={"p-6 bg-gray-775 rounded-lg"}>
                                                <h4>Delete Account</h4>
                                                <p className={"pt-1 pb-6 text-sm"}>
                                                    By hitting the button below, your account will be placed in an automatic deletion queue that executes once a day.
                                                </p>
                                                <div className="flex">
                                                    <button type={"button"} onClick={() => setDeletionModel(true)} className={"button small red"}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {deletionModel && (
                            <div className={"bg-black bg-opacity-50 absolute top-0 right-0 bottom-0 left-0 z-50"}>
                                <div className={"flex h-full w-full"}>
                                    <div className={"relative m-auto w-80 bg-gray-700 text-white rounded p-4"}>
                                        <button type={"button"} onClick={() => setDeletionModel(false)} className={"absolute top-2 right-2 focus:outline-none text-gray-200 hover:text-gray-400 transition ease-in-out duration-300"}>
                                            <FontAwesomeIcon icon={faTimesCircle} />
                                        </button>
                                        <div className={"text-base text-gray-300"}>
                                            Please enter <span className={"text-white font-semibold"}>{name}</span> in the input field to delete this account.
                                        </div>
                                        <div className={"text-base text-gray-300 mt-4"}>
                                            This <span className={"font-semibold"}>cannot</span> be reversed.
                                        </div>
                                        <input type={"text"} className={"input-settings my-4"} onChange={(e) => setDeletionText(e.target.value)} value={deletionText} placeholder={name} />
                                        <button type={"button"} onClick={handleDelete} className={`flex ml-auto rounded transition ease-in-out duration-300 focus:outline-none bg-red-500 hover:bg-red-600 px-3 py-1 text-sm text-white ${name === deletionText ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingsFrame;