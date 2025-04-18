import { useSearchParams, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<'pending'|'ok'|'bad'>('pending');

  useEffect(() => {
    const token = params.get('token');
    api.get(`/auth/verify?token=${token}`)
      .then(() => setStatus('ok'))
      .catch(() => setStatus('bad'));
  }, [params]);

  if (status === 'pending') return <p>Verifying…</p>;
  if (status === 'bad')     return <p>Invalid token. <Link to="/register">Try again</Link></p>;
  return <p>Email verified! <Link to="/login">Log in</Link></p>;
}
