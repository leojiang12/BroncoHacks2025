import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

interface MeResponse {
  userId: number;
}

export default function Dashboard() {
  const auth = useContext(AuthContext)!;
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    interface AxiosResponse<T> {
        data: T;
    }

    interface AxiosError {
        message: string;
    }

    api
        .get<MeResponse>('/me')
        .then((res: AxiosResponse<MeResponse>) => setMe(res.data))
        .catch((error: AxiosError) => {});
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {me && <p>Your user ID: {me.userId}</p>}
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
}
