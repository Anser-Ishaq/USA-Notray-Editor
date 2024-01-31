import { useState } from 'react';

import { useLogin } from '@/service/user';
import { AuthResponse } from '@/types';

import reactLogo from '../assets/react.svg';

const Home = () => {
  const [count, setCount] = useState(0);

  const { mutate: loginUser, status, data } = useLogin();

  const onLogin = () => {
    loginUser({ username: 'kminchelle', password: '0lelplR' });
  };

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-2xl font-sans font-bold my-5">Vite + React</h1>
      <div className="card">
        <button
          className="border-0 bg-blue-300 rounded-md m-3 p-3"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>

        <button
          className="border-0 bg-blue-300 rounded-md m-3 p-3"
          onClick={onLogin}
        >
          Trigger Dummy API
        </button>
        <p>API Status: {status}</p>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        {status === 'success' ? (
          <code>
            {Object?.keys(data)
              ?.filter((k) => k !== 'token')
              ?.map((k, idx) => (
                <p key={idx}>
                  {k}: {data[k as keyof AuthResponse]}
                </p>
              ))}
          </code>
        ) : null}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

export default Home;
