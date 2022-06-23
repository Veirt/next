import { faDiscord, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faAt, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { CancelTokenSource } from 'axios';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Link from '../../components/Uncategorized/Link';
import Redirect from '../../components/Uncategorized/Redirect';
import Config from '../../Config';
import { usePlayerContext } from '../../contexts/Player.context';
import useCSRF from '../../hooks/useCSRF';
import { Meta } from '../../layout/Meta';
import Base from '../../templates/Base';

const Login = () => {
  const { _csrf } = useCSRF();
  const { sessionData, getSessionData } = usePlayerContext();
  const axiosCancelSource = useRef<CancelTokenSource | null>(null);

  const [redirect, setRedirect] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const AuthProviders = [
    { callback: 'discord', name: 'Discord', icon: faDiscord, color: 'text-white', bg: 'bg-indigo-500' },
    { callback: 'google', name: 'Google', icon: faGoogle, color: 'text-white', bg: 'bg-red-500' },
    { callback: 'github', name: 'GitHub', icon: faGithub, color: 'text-white', bg: 'bg-gray-700' },
  ];

  const FormInput = [
    {
      icon: faAt,
      name: 'email',
      type: 'email',
      placeholder: 'Email Address',
      value: emailAddress,
      onChange: setEmailAddress,
    },
    {
      icon: faKey,
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      value: password,
      onChange: setPassword,
    },
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(`${Config.authUrl}/login`, { emailAddress, password, _csrf }, { cancelToken: axiosCancelSource.current?.token, withCredentials: true })
      .then((response) => {
        if (!response.data.error) {
          getSessionData();
          return setRedirect('/');
        } else return toast.error(response.data.error);
      })
      .catch(() => toast.error('Unexpected error occurred!'));
  };

  useEffect(() => {
    axiosCancelSource.current = axios.CancelToken.source();
    return () => axiosCancelSource.current?.cancel();
  }, []);

  useEffect(() => {
    if (sessionData && sessionData.authName !== 'Guest') setRedirect('/');
  }, [sessionData]);

  return (
    <Base meta={<Meta title={'Login'} />} ads={{ enableBottomRail: true }} noNav isLoaded={true}>
      {redirect && <Redirect to={redirect} />}
      <div className="flex h-screen text-white">
        <div className="w-full sm:w-128 m-auto px-4 md:px-10">
          <div className="bg-gray-775 rounded-2xl shadow-lg p-5 md:p-8">
            <h1>Login</h1>
            <form method="post" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-3 my-6">
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {AuthProviders.map((item) => (
                      <Link key={item.callback} to={`${Config.oauthUrl}/${item.callback}`} className={`${item.bg} hover:opacity-70 transition ease-in-out duration-300 rounded shadow`}>
                        <div className="flex items-center justify-center p-2">
                          <FontAwesomeIcon icon={item.icon} className={`${item.color} text-xl`} />
                          <span className="ml-2 font-semibold">{item.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-3 text-center text-lg font-semibold">OR</div>
                </div>
                {FormInput.map((item, index) => (
                  <div key={index} className="form-combo">
                    <div>
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <input type={item.type} name={item.name} placeholder={item.placeholder} value={item.value} onChange={(e) => item.onChange(e.target.value)} required />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-y-2">
                <div className="col-span-full text-center xs:text-left xs:col-span-3 my-auto">
                  <Link to="/auth/forgot" className="hover:opacity-70 transition ease-in-out duration-300">
                    Forgot your password?
                  </Link>
                </div>
                <div className="col-span-full xs:col-span-2">
                  <button type="submit" className="flex mx-auto xs:mr-0 xs:ml-auto button small lightgray">
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
          <Link to="/auth/signup" className="text-lg block mt-4 text-center font-semibold hover:opacity-70 transition ease-in-out duration-300">
            Don't have an account?
          </Link>
        </div>
      </div>
    </Base>
  );
};

export default Login;
