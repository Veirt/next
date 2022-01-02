import {Fragment} from 'react';
import {PlayerExtendedData, PlayerStatisticData} from "../../types.client.mongo";
import {useTranslation} from "next-i18next";
import moment from "moment";
import useConfig from "../../hooks/useConfig";
import {PlayerRankedExtendedData} from "../Leaderboard/LeaderboardPlayerRanked";
import ProfileStatisticChart, {PlayerStatisticChartData} from "./ProfileStatisticChart";

interface IProps {
    statisticData: PlayerStatisticData | null;
    profileData: PlayerExtendedData | null;
    chartData: PlayerStatisticChartData | null;
    rankedData: PlayerRankedExtendedData | null;
}

const ProfileStatistics = (props: IProps) => {

    const { statisticData, profileData, chartData, rankedData } = props;
    const { useCPM } = useConfig();
    const { t } = useTranslation();

    let usePlaytime = '';
    if (profileData) {
        if (profileData.playtime < 60)
            usePlaytime = `${Math.floor(profileData.playtime)} seconds`;
        else if (profileData.playtime < 3600)
            usePlaytime = `${Math.floor(profileData.playtime / 60)} minutes`;
        else
            usePlaytime = `${Math.floor(profileData.playtime / (60 * 60))} hours`;
    }

    const blockItems = [
        {
            title: 'page.profile.personal',
            css: 'lg:col-span-4',
            items: [
                { label: 'page.profile.fullname', value: profileData?.fullName },
                { label: 'page.profile.country', value: profileData?.country.name === 'None' ? null : profileData?.country.name },
                { label: 'page.profile.joined', value: moment.unix(profileData?.created || 0).fromNow() }
            ]
        },
        {
            title: 'page.profile.keyboard.title',
            css: 'lg:col-span-4',
            items: [
                { label: 'page.profile.keyboard.layout', value: profileData?.keyboardLayout },
                { label: 'page.profile.keyboard.brand', value: profileData?.keyboardBrand },
                { label: 'page.profile.keyboard.model', value: profileData?.keyboardModel }
            ]
        },
        {
            title: 'PROFILE_RANKED',
            css: 'lg:col-span-4',
            items: []
        },
        {
            title: 'page.profile.general',
            css: 'lg:col-span-3',
            items: [
                { label: 'page.profile.level', value: profileData?.Level?.Index },
                { label: 'statistics.exp', value: profileData?.experience && profileData?.experience < 1000 ? profileData?.experience : `${Math.floor((profileData?.experience || 0) / 1000)}K` },
                { label: 'statistics.playtime', value: usePlaytime }
            ]
        },
        {
            title: 'statistics.records',
            css: 'lg:col-span-3',
            items: [
                { label: useCPM === '1' ? 'statistics.cpm' : 'statistics.wpm', value: useCPM === '1' ? Math.round((statisticData?.highestWPM || 0) * 5) : statisticData?.highestWPM },
                { label: 'statistics.exp_total', value: statisticData?.highestEXP || 0 },
                { label: 'statistics.wpm_fastest', value: (statisticData?.lowestElapsed && statisticData.lowestElapsed < 999) ? statisticData?.lowestElapsed : 'None' }
            ]
        },
        {
            title: 'component.navbar.matches',
            css: 'lg:col-span-3',
            items: [
                { label: 'statistics.won', value: (statisticData?.matchesWon || 0).toLocaleString() },
                { label: 'statistics.lost', value: (statisticData?.matchesLost || 0).toLocaleString() },
                { label: 'statistics.ratio', value: (statisticData?.matchesWon && statisticData?.matchesLost) ? (statisticData.matchesWon / statisticData.matchesLost).toFixed(1) : 0 },
            ]
        },
        {
            title: 'statistics.tournaments',
            css: 'lg:col-span-3',
            items: [
                { label: 'statistics.total', value: (statisticData?.tournamentsLost || 0) + (statisticData?.tournamentsWon || 0) + (statisticData?.tournamentsTop5 || 0) },
                { label: 'statistics.won', value: (statisticData?.tournamentsWon || 0).toLocaleString() },
                { label: 'statistics.top5', value: (statisticData?.tournamentsTop5 || 0).toLocaleString() },
            ]
        },
    ];

    return (profileData && statisticData) ? (
        <>
            <h2 className={"headingBox"}>{t('component.navbar.statistics')}</h2>
            <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4"}>
                {blockItems.map((block, index) => block.title !== 'PROFILE_RANKED' ? (
                    <div key={index} className={`bg-gray-750 rounded-xl shadow-lg p-4 ${block.css}`}>
                        <div className={"text-orange-400 pb-2 font-semibold uppercase text-2xl"}>{t(block.title)}</div>
                        <div className={"grid grid-cols-1 gap-2"}>
                            {/* @ts-ignore */}
                            {block.items.map((item, key) => (item && (typeof item.value !== 'undefined' && (item.value !== null && item.value !== ""))) ? (
                                <div key={key}>
                                    <div className={"text-base text-gray-400 uppercase font-semibold"}>{t(item.label)}</div>
                                    <div className={"text-xl text-white uppercase font-semibold"}>{item.value}</div>
                                </div>
                            ) : <Fragment key={key}></Fragment>)}
                        </div>
                    </div>
                ) : (
                    <div key={index} className={`bg-gray-750 shadow-lg rounded-xl p-4 ${block.css}`}>
                        <div className={"flex h-full"}>
                            <div className={"m-auto"}>
                                {rankedData && (
                                    <div className={"flex"}>
                                        <div className={"w-44 lg:w-52 my-auto"}>
                                            <img className={"w-full h-full"} src={`/ranks/${rankedData?.Rank.Rank.toLowerCase()}.png`} alt={rankedData?.Rank.Rank} />
                                        </div>
                                        <div className={"w-full my-auto"}>
                                            {(rankedData && rankedData.Rank.Rank <= 'Unranked') && (
                                                <div className={"text-white uppercase text-2xl lg:text-5xl font-bold"}>
                                                    {rankedData?.rating}<span className={"text-orange-400 text-xl lg:text-3xl"}>SR</span>
                                                </div>
                                            )}
                                            <div className={"text-white opacity-70 uppercase text-lg lg:text-2xl font-semibold"}>{rankedData?.Rank.Rank}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {chartData !== null && (
                <div className="mt-10">
                    <h2 className={"headingBox"}>{t('page.profile.progress')}</h2>
                    <div className={"p-4 xl:p-8 rounded-xl shadow-lg bg-gray-750 text-white text-center font-semibold uppercase"}>
                        <ProfileStatisticChart {...chartData} />
                    </div>
                </div>
            )}
        </>
    ) : <></>
}

export default ProfileStatistics;