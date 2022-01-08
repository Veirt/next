import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import {faDiscord, faFacebookF, faGithub, faPatreon, faReddit, faTwitter} from "@fortawesome/free-brands-svg-icons";
import Userbar from "./Userbar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faGamepad,
    faListAlt,
    faNewspaper,
    faStoreAlt,
    faTrophy
} from "@fortawesome/free-solid-svg-icons";
import {usePlayerContext} from "../contexts/Player.context";
import { useRouter } from 'next/router';

const Levelbar = () => {

    const router = useRouter();
    const { t } = useTranslation();

    const isNotSmallDevice = useMediaQuery({ query: '(min-width: 1224px)' })

    const { sessionData, isGuest } = usePlayerContext();
    const [ scroll, setScroll ] = useState<boolean>(false);
    const [ toggleSitebar, setToggleSitebar ] = useState(false);
    const [ smallDevice, setSmallDevice ] = useState<boolean>(false);

    const links = [
        {
            name: 'component.bottombar.about',
            link: '/about/us',
            external: false,
        },
        {
            name: 'component.bottombar.contribute',
            link: '/about/contribute',
            external: false,
        },
        {
            name: 'component.bottombar.tos',
            link: '/about/tos',
            external: false,
        },
        {
            name: 'component.bottombar.privacy',
            link: '/about/privacy',
            external: false,
        },
        {
            name: 'component.bottombar.troubleshooting',
            link: '/about/troubleshooting',
            external: false,
        },
        {
            name: 'component.bottombar.faqM',
            link: '/about/faq',
            external: false,
        },
    ];

    const socials = [
        {
            name: 'Discord',
            icon: faDiscord,
            color: 'hover:text-orange-700',
            link: 'https://discord.gg/df4paUq',
        },
        {
            name: 'Twitter',
            icon: faTwitter,
            color: 'hover:text-blue-400',
            link: 'https://twitter.com/KeymashGame',
        },
        {
            name: 'Reddit',
            icon: faReddit,
            color: 'hover:text-orange-700',
            link: 'https://reddit.com/r/Keymash',
        },
        {
            name: 'Patreon',
            icon: faPatreon,
            color: 'hover:text-red-600',
            link: 'https://patreon.com/KeymashGame',
        },
        {
            name: 'Merch',
            icon: faStoreAlt,
            color: 'hover:text-orange-700',
            link: 'https://keymash.creator-spring.com/',
        },
        {
            name: 'GitHub',
            icon: faGithub,
            color: 'hover:text-gray-400',
            link: 'https://github.com/Keyma-sh/game-tracker',
        }
    ];

    const navCSS = `desktopNav-item`;
    const activeCSS = `levelbar-active`;

    const mobileNavCSS = `mobileNav-item`;
    const mobileActiveCSS = `levelbar-active`;

    const handleDeviceSizing = () => { console.log('handleDeviceSizing Called'); setSmallDevice(!isNotSmallDevice); }
    const handleDeviceScroll = () => setScroll(window.scrollY >= 20);

    useEffect(() => {
        handleDeviceSizing();
        if (typeof window !== `undefined`) {
            window?.addEventListener(`resize`, handleDeviceSizing);
            window?.addEventListener(`scroll`, handleDeviceScroll);
        }
      
        return () => {
            window?.removeEventListener('resize', handleDeviceSizing);
            window?.removeEventListener('scroll', handleDeviceScroll);
        }
    }, [ isNotSmallDevice ])

    return (
        smallDevice ? (
            <>
                <div className={"fixed top-0 left-0 right-0 z-50 bg-gray-775 shadow"}>
                    <div className={"flex py-1 px-2 justify-between"}>
                        <div className={"w-auto pt-1 my-auto"}>
                            <button type={"button"} onClick={() => setToggleSitebar(!toggleSitebar)} className={"w-8 my-auto focus:outline-none"}>
                                <img src={"/assets/logo_svg.svg"} alt={"Logo"} className={"w-full h-auto"} />
                            </button>
                        </div>
                        <div className={"w-auto"}>
                            <Userbar />
                        </div>
                    </div>
                </div>

                <div className={"fixed grid grid-cols-4 bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-850 to-gray-775 border-t border-gray-750 shadow"}>
                    <Link href={"/"}>
                        <div className={`${mobileNavCSS} ${router.asPath === "/" && mobileActiveCSS} text-center text-xxs`}>
                            <FontAwesomeIcon icon={faGamepad} className={"mb-2 text-2xl"} />
                            <div>{t('component.navbar.play')}</div>
                        </div>
                    </Link>
                    <Link href={"/news"}>
                        <div className={`${mobileNavCSS} ${router.asPath.startsWith("/news") && mobileActiveCSS} text-center text-xxs`}>
                            <FontAwesomeIcon icon={faNewspaper} className={"mb-2 text-2xl"} />
                            <div>{t('component.navbar.news')}</div>
                        </div>
                    </Link>
                    <Link href={"/leaderboards"}>
                        <div className={`${mobileNavCSS} ${router.asPath.startsWith("/leaderboards") && mobileActiveCSS} text-center text-xxs`}>
                            <FontAwesomeIcon icon={faListAlt} className={"mb-2 text-2xl"} />
                            <div>{t('component.navbar.leaders')}</div>
                        </div>
                    </Link>
                    <Link href={"/competitions"}>
                        <div className={`${mobileNavCSS} ${router.asPath.startsWith("/competitions") && mobileActiveCSS} text-center text-xxs`}>
                            <FontAwesomeIcon icon={faTrophy} className={"mb-2 text-2xl"} />
                            <div>{t('component.navbar.tournaments')}</div>
                        </div>
                    </Link>
                </div>
            </>
        ) : (
            <>
                <div className={`hidden lg:block fixed top-0 left-0 right-0 z-50 ${scroll ? 'bg-gradient-to-r from-gray-750 to-gray-775 py-1.5 shadow-lg' : 'py-2.5'} transition-all`}>
                    <div className={"container flex"}>
                        <div className={"flex space-x-2"}>
                            <button type={"button"} onClick={() => setToggleSitebar(!toggleSitebar)} className={"w-7 my-auto hover:opacity-50 transition ease-in-out duration-300 focus:outline-none"}>
                                <img src={'/assets/logo_svg.svg'} alt={"Logo"} className={"w-full h-auto"} />
                            </button>
                            <div className="w-auto my-auto">
                                <div className="text-3xl text-white uppercase font-bold" style={{ marginTop: '-2px' }}>
                                    Keyma<span className="text-orange-400">.</span>sh
                                </div>
                            </div>
                        </div>
                        <Link href={"/"} passHref>
                          <a className={`${navCSS} ${router.asPath === "/" && activeCSS}`}>{t('component.navbar.play')}</a>
                        </Link>
                        {isGuest && (
                          <Link href={"/about/us"} passHref>
                            <a className={`${navCSS} ${router.asPath.startsWith("/about/us") && activeCSS}`}>{t('component.bottombar.about')}</a>
                          </Link>
                        )}
                        <Link href={"/news"} passHref>
                          <a className={`${navCSS} ${router.asPath.startsWith("/news") && activeCSS}`}>{t('component.navbar.news')}</a>
                        </Link>
                        {!isGuest && (
                          <Link href={"/challenges"} passHref>
                            <a className={`${navCSS} ${router.asPath.startsWith("/challenges") && activeCSS}`}>{t('component.navbar.challenges')}</a>
                          </Link>
                        )}
                        <Link href={"/leaderboards"} passHref>
                          <a className={`${navCSS} ${router.asPath.startsWith("/leaderboards") && activeCSS}`}>{t('component.navbar.leaders')}</a>
                        </Link>
                        <Link href={"/competitions"} passHref>
                          <a className={`${navCSS} ${router.asPath.startsWith("/competitions") && activeCSS}`}>{t('component.navbar.tournaments')}</a>
                        </Link>
                        {sessionData && (
                            <div className={"ml-auto my-auto w-80"} >
                                <div className={"flex justify-end py-1"}>
                                    <Userbar />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ left: `${!toggleSitebar ? '-80' : '0'}%` }} className={"w-44 z-20 fixed top-0 left-0 bottom-0 h-screen bg-gray-900 transition-all ease-in-out duration-300"}>
                    {links.map((item) => (
                      <Link key={item.link} href={item.link}>
                        <a className={`block hover:bg-gray-825 transition ease-in-out duration-300 p-3 text-sm uppercase font-semibold text-white tracking-tight ${router.asPath.startsWith(item.link) && "bg-gray-825"}`}>{t(item.name)}</a>
                      </Link>
                    ))}
                    <div className={"border-t border-gray-800"} />
                    {socials.map((item) => (
                        <a key={item.link} href={item.link} target="_blank" rel="noreferrer" className={"flex hover:bg-gray-825 transition ease-in-out duration-300 p-3 text-sm uppercase font-semibold text-white tracking-tight"}>
                            <div className={"w-12"}>
                                <FontAwesomeIcon icon={item.icon} />
                            </div>
                            <div className={"w-auto"}>
                                {item.name}
                            </div>
                        </a>
                    ))}

                </div>
            </>
        )
    );
}

export default Levelbar;
