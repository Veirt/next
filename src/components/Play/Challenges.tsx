import {useCallback, useEffect, useRef, useState} from "react";
import {PlayerChallengeData} from "../../types.client.mongo";
import axios, {CancelTokenSource} from "axios";
import Config from "../../Config";
import Challenge from "../../components/Challenges/Challenge";
import {useTranslation} from "next-i18next";
import {toast} from "react-toastify";

const getTomorrow = (created: string) => {
    const date = new Date(created);
    date.setDate(date.getDate() + 1);
    return date.getTime() / 1000;
}

const Challenges = () => {

    const { t } = useTranslation();
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    const [ redirect, setRedirect ] = useState<string>('');

    const [ challengesData, setChallengesData ] = useState<PlayerChallengeData[]>([]);
    const [ challengesLoaded, setChallengesLoaded ] = useState<boolean>(false);

    const getChallenges = useCallback(() => {
        axios.get(`${Config.apiUrl}/player/challenges`, { withCredentials: true, cancelToken: axiosCancelSource.current?.token, })
            .then(response => {
                if (!response.data.error) {
                    setChallengesData(response.data);
                    setChallengesLoaded(true);
                } else {
                    toast.error(response.data.error);
                    setRedirect('/');
                }
            })
            .catch(e => console.log(e));
    }, []);

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        getChallenges();
        return () =>  axiosCancelSource.current?.cancel();
    }, [ getChallenges ]);

    return challengesLoaded ? (
        <div>
            <div className="h1">{t('Challenges')}</div>
            <p className="pb-6 pt-2">
                You will be given two challenges every day.
            </p>
            <div className="grid grid-cols-1 gap-6">
                {challengesData.map((item) => (
                    <div key={item.challengeId} className={"col-span-full p-4 bg-gray-775 rounded-xl"}>
                        <Challenge {...item} />
                    </div>
                ))}
            </div>
        </div>
    ) : <></>;
}

export default Challenges;