import {FC, useEffect, useRef, useState} from 'react';
import {PlayerChallengeData} from "../../types.client.mongo";
import {faCoins} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios, {CancelTokenSource} from "axios";
import Config from "../../Config";
import {toast} from "react-toastify";
import useCSRF from "../../hooks/useCSRF";

const Challenge:FC<PlayerChallengeData> = (props) => {

    const { value, challenge, mode, finished } = props;
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    const { _csrf } = useCSRF();

    const [ redeem, setRedeem ] = useState<boolean>(false);

    const redeemChallenges = () => {
        axios.post(`${Config.apiUrl}/player/redeem`, { _csrf }, { withCredentials: true, cancelToken: axiosCancelSource.current?.token, })
            .then(response => {
                if (!response.data.error) {
                    setRedeem(true);
                    toast.success("Redeemed!");
                } else
                    toast.error("You have nothing to redeem!");
            })
            .catch(e => console.log(e));
    }

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        return () =>  axiosCancelSource.current?.cancel();
    }, [ ]);

    return (challenge[0] && mode[0]) ? (
        <div>
            <div className={"w-full sm:w-64 mx-auto py-1 relative z-10 font-bold bg-gray-800 shadow -mb-6 text-center text-orange-400 text-2xl rounded-2xl"}>
                {mode[0].modeName}
            </div>
            <div className={"bg-gray-775 p-8 rounded-2xl"}>
                <div className={"pt-8 pb-4 lg:pt-16 lg:pb-8"}>
                    <img src={`/challenges/${challenge[0].type}.png`} alt={challenge[0].text} className={"w-11/12 sm:w-10/12 md:w-9/12 xl:w-auto block mx-auto transform scale-challenge"} />
                </div>
                <div className={"text-white text-base rounded-2xl text-center text-sm py-1.5 font-bold uppercase mb-6"}>
                    {challenge[0].text}
                </div>
                <div className={"bg-gray-800 text-xl md:text-2xl xl:text-3xl text-orange-400 rounded-2xl text-center py-2 font-bold uppercase mb-6"}>
                    {value > challenge[0].value ? challenge[0].value.toLocaleString() : value.toLocaleString()}<span className={"text-white"}>/{challenge[0].value.toLocaleString()}</span>
                </div>
                <button type={"button"} className={`${(!finished || finished === 2 || redeem) ? 'opacity-50 pointer-events-none' : 'opacity-100'} rounded-2xl focus:outline-none bg-orange-400 hover:bg-orange-500 text-orange-700 transition ease-in-out duration-300 font-bold text-lg xl:text-xl py-4 text-center block w-full`} onClick={redeemChallenges}>
                    {(redeem || finished === 2) ? 'Redeemed' : 'Redeem'}
                </button>
            </div>
            <div className={"w-4/5 mx-auto py-3 font-bold bg-gray-800 shadow -mt-4 text-center text-white text-xl xl:text-2xl rounded-2xl"}>
                <FontAwesomeIcon icon={faCoins} className={"text-yellow-400 mr-1"} />
                {challenge[0].rewards?.currency.toLocaleString()}
            </div>
        </div>
    ) : <></>;
}

export default Challenge;