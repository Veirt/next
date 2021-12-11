import { faDotCircle } from "@fortawesome/free-regular-svg-icons";
import { faAt, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { CancelTokenSource } from "axios";
import { GetServerSidePropsContext } from "next";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Redirect from "../../../components/Uncategorized/Redirect";
import Config from "../../../Config";
import { usePlayerContext } from "../../../contexts/Player.context";
import useCSRF from "../../../hooks/useCSRF";
import { Meta } from "../../../layout/Meta";
import Base from "../../../templates/Base";

interface IProps {
    code?: string;
}

const Forgot = (props: IProps) => {
    const { _csrf } = useCSRF();
    const { sessionData } = usePlayerContext();
    const axiosCancelSource = useRef<CancelTokenSource | null>(null);
    
    const [ redirect, setRedirect ] = useState<string>('');
    const [ emailAddress, setEmailAddress ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ code, setCode ] = useState<string>(props.code || '');

    const FormInput = [
        { icon: faAt, name: "email", type: "email", placeholder: "Email Address", value: emailAddress, onChange: setEmailAddress },
        { icon: faKey, name: "password", type: "password", placeholder: "Password", value: password, onChange: setPassword },
        { icon: faDotCircle, name: "code", type: "text", placeholder: "Code", value: code, onChange: setCode }
    ]

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        axios.post(`${Config.authUrl}/forgot`, { emailAddress, password, key: code, _csrf }, { cancelToken: axiosCancelSource.current?.token, withCredentials: true })
            .then((response) => {
                if (!response.data.error) 
                    return setRedirect('/auth/login');
                else
                    return toast.error(response.data.error);
            })
            .catch(() => toast.error("Unexpected error occurred!"));
    };

    useEffect(() => {
        axiosCancelSource.current = axios.CancelToken.source();
        return () => axiosCancelSource.current?.cancel();
    }, [ ]);

    useEffect(() => {
        if (sessionData && sessionData.authName !== 'Guest') 
            setRedirect('/');
    }, [ sessionData ]);

    return (
        <Base meta={<Meta title={"Recovery"} />} ads={{ enableBottomRail: true }} noNav isLoaded={true}>
            {redirect && <Redirect to={redirect} />}
            <div className="flex h-screen text-white">
                <div className="w-full sm:w-128 m-auto px-4 md:px-10">
                    <div className="bg-gray-775 rounded-2xl shadow-lg p-5 md:p-8">
                        <h1>Recovery</h1>
                        <form method="post" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-3 my-6">
                                {FormInput.map((item, index) => (
                                    <div key={index} className="form-combo">
                                        <div>
                                            <FontAwesomeIcon icon={item.icon} />
                                        </div>
                                        <input type={item.type} name={item.name} placeholder={item.placeholder} value={item.value} onChange={(e) => item.onChange(e.target.value)} required />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <button type="submit" className="flex ml-auto button small lightgray">Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Base>
    )
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
    return {
        props: {
            code: query?.code || '',
        },
    };
}

export default Forgot;