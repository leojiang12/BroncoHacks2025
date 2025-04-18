// client/src/pages/OAuth2RedirectHandler.tsx
import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Typography } from 'antd';
import { AuthContext } from '../contexts/AuthContext';
import PageLayout from '../components/PageLayout';

const { Paragraph } = Typography;

export default function OAuth2RedirectHandler() {
  const [params]     = useSearchParams();
  const navigate     = useNavigate();
  const auth         = useContext(AuthContext)!;
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      // store & go
      auth.setToken(token);
      navigate('/dashboard', { replace: true });
    } else {
      // show error state
      setError('Authentication failed: no token returned.');
      setLoading(false);
    }
  }, [params, auth, navigate]);

  return (
    <PageLayout title="Signing you in…">
      {loading && !error && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: 16 }}>Please wait...</Paragraph>
        </div>
      )}

      {error && (
        <Alert
          type="error"
          message="Sign‑in Error"
          description={error}
          showIcon
          action={
            <a onClick={() => navigate('/login', { replace: true })}>
              Back to login
            </a>
          }
        />
      )}
    </PageLayout>
  );
}
