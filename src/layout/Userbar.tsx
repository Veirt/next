import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useTranslation } from 'next-i18next';
import axios, {CancelTokenSource} from "axios";
import Config from "../Config";
import {faBell, faCog, faSignInAlt, faSignOutAlt, faSpinner, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Notification from "../components/Uncategorized/Notification";
import {usePlayerContext} from "../contexts/Player.context";
import usePlayerToken from "../hooks/usePlayerToken";
import {PlayerNotificationData} from "../types.client.mongo";
import PlayerAvatar from "../components/Player/PlayerAvatar";
import SettingsFrame from "../components/Settings/SettingsFrame";
import Link from '../components/Uncategorized/Link';

interface IProps {
    isSidebar?: boolean;
}

const Userbar = (props: IProps) => {
    const axiosCancelSource = useRef<CancelTokenSource | null>();

    const { sessionData, isGuest, notificationData, notificationCount, deleteNotifications, readNotifications } = usePlayerContext();
    const { t } = useTranslation();

    const [ toggleNotifications, setToggleNotifications ] = useState(false);
    const [ isLoaded, setIsLoaded ] = useState(false);
    const { isSidebar } = props;

    /* --------- Settings */
    const [ showSettings, setShowSettings ] = useState<boolean>(false);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();

        if (window) {
            setIsLoaded(true);
            window.addEventListener('click', notificationToggleManual);
        }

        return () => {
            axiosCancelSource.current?.cancel();
            window.removeEventListener('click', notificationToggleManual);
        }
    }, [ ]);

    const logoutNow = () => {
        axios.get(`${Config.oauthUrl}/logout`, { withCredentials: true, })
            .then(() => window.location.reload())
            .catch(() => window.location.reload())
    }

    const notificationsEffect = useCallback(() => {
        if (!toggleNotifications)
            readNotifications();
    }, [ toggleNotifications ]);

    useEffect(() => {
        notificationsEffect();
    }, [ notificationsEffect ]);


    const notificationToggleManual = (e: MouseEvent) => {
        if ((e.target as Element).classList.contains('notificationsWrapper'))
            setToggleNotifications(false);
    }

    const playerItems = [
        {
            title: 'component.navbar.logout',
            icon: { name: faSignOutAlt },
            target: '_self',
            route: ``,
            onClick: () => logoutNow(),
            isAuth: true
        },
        {
            title: 'component.navbar.settings',
            icon: { name: faCog },
            target: '_self',
            route: '',
            onClick: () => setShowSettings(true),
            isAuth: true,
        },
        {
            title: 'component.navbar.notifications',
            icon: { name: faBell, css: 'text-pink-700' },
            target: '_self',
            route: '',
            onClick: () => setToggleNotifications(!toggleNotifications),
            isAuth: true,
        },
        {
            title: 'component.navbar.login',
            icon: { name: faSignInAlt, css: 'text-gray-300' },
            target: '_self',
            route: '/auth/login',
            isAuth: false,
        },
    ];

    return (
        <>
            {!isGuest && <SettingsFrame isVisible={showSettings} onClose={() => setShowSettings(false)} />}
            {(isLoaded && toggleNotifications) && <div className={"notificationsWrapper fixed z-10 top-0 right-0 left-0 bottom-0 w-screen h-screen "} />}
            {(isLoaded && sessionData !== null) ? (
                <div className={`flex flex-wrap ${isSidebar ? 'flex-row-reverse justify-center gap-y-4 lg:gap-y-0' : 'justify-center lg:justify-end'}`}>
                    {(sessionData && isGuest) ? (
                        <>
                            <div className={`w-auto my-auto`}>
                                <div className="hidden lg:flex text-base text-white font-semibold tracking-wider">
                                    <div className={"w-8"}>
                                        <PlayerAvatar source={sessionData?.avatarSrc || ''} />
                                    </div>
                                    <div className={"w-auto my-auto pl-2"}>
                                        {sessionData.name}
                                    </div>
                                </div>
                            </div>
                            <div className={`w-auto relative ${isSidebar? 'pl-0 lg:pl-3' : 'pl-3'}`}>
                                <Link to="/auth/login" className="block focus:outline-none text-base hover:bg-gray-775 rounded tracking-wider uppercase py-2 px-3 hover:opacity-70 transition ease-in-out duration-200 text-white font-semibold">
                                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                                    <span>{t('component.navbar.login')}</span>
                                </Link>
                            </div>
                        </>
                    ) : playerItems.map(item => ((!item.isAuth && isGuest) || (!isGuest && item.isAuth)) && (
                        <div key={"userbar" + item.title} className={`w-auto my-auto ${isSidebar? 'pl-0 lg:pl-3' : 'pl-3'}`}>
                            {!item.onClick ? (
                                <Link to={item.route} className={`activeClassName[text-orange-400] nav-link text-white text-lg rounded tracking-wider uppercase px-0.5 hover:text-orange-400 transition ease-in-out duration-300 font-semibold`}>
                                    <FontAwesomeIcon icon={item.icon.name} />
                                </Link>
                            ) : (
                              <div className="relative">
                                  <button type="button" onClick={item.onClick} className={`nav-link ${(item.title === 'component.navbar.notifications' && toggleNotifications) ? 'text-orange-400' : 'text-white'} hover:text-orange-400 text-lg rounded tracking-wider uppercase px-0.5 hover:text-orange-400 transition ease-in-out duration-300 font-semibold`}>
                                      <FontAwesomeIcon icon={item.icon.name} />
                                      {item.title === 'component.navbar.notifications' && notificationCount > 0 && (
                                          <div className="absolute -bottom-px -right-0.5 bottom-0.5 border-2 border-gray-775 bg-blue-400 rounded-full h-3 w-3 flex items-center justify-center" />
                                      )}
                                  </button>
                                  {item.title === 'component.navbar.notifications' && (
                                        <div className={`${toggleNotifications ? 'is-active' : 'is-not'} dropdown dropdown-2xl w-128 shadow-lg right-0`}>
                                            <div className={"bg-gray-700 rounded-t-2xl shadow flex py-2 px-4"}>
                                                <div className={"w-auto mr-auto"}>
                                                    <span className={"text-base  text-white uppercase font-semibold"}>
                                                        {t('component.navbar.notifications')}
                                                    </span>
                                                </div>
                                                <div className={"w-auto my-auto"}>
                                                    <button className={"focus:outline-none text-orange-400 hover:opacity-70 transition ease-in-out duration-300"} type={"button"} onClick={deleteNotifications}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </div>
                                            {notificationData !== null && (
                                                <div className={"h-96 bg-gray-750 rounded-b-2xl overflow-y-scroll overflow-x-hidden"}>
                                                    {notificationData?.length !== 0 
                                                        ? notificationData?.map((row, index) => <Notification key={"notification" + (row._id || index)} {...row} />)
                                                        : <div className="pt-16 text-center">You have no notifications!</div>
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    )}
                              </div>
                            )}
                        </div>
                    ))}
                    {!isGuest && (
                        <Link to={`/profile/${sessionData.name}-${sessionData.discriminator}`} className={`flex w-auto my-auto ${isSidebar? 'pl-0 lg:pl-3' : 'pl-3'}`}>
                            <div className={'block w-12 my-auto p-0.5 ml-3 border-2 border-gray-500 border-opacity-50 hover:border-orange-400 hover:border-opacity-50 transition ease-in-out duration-200 rounded-full'}>
                                <PlayerAvatar source={sessionData.avatarSrc} hideBorder />
                            </div>
                        </Link>
                    )}
                    
                </div>
            ) : (
                <div className="font-semibold">
                    <FontAwesomeIcon icon={faSpinner} className="mr-2" spin />
                    Loading
                </div>
            )}
        </>
    )
}

export default Userbar;
