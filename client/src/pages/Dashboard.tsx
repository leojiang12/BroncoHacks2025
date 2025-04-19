// client/src/pages/Dashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button, Upload, message, Spin, Space } from 'antd';
import { LogoutOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import PageLayout from '../components/PageLayout';
import { TryOnResult } from '../components/TryOnCanvas';

interface MeResponse {
  userId: number;
  username: string;
}

type Status = 'idle' | 'uploading' | 'processing' | 'ready';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [me, setMe] = useState<MeResponse | null>(null);

  // Try‑On state
  const [fileList, setFileList] = useState<File[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    api.get<MeResponse>('/me')
      .then(res => setMe(res.data))
      .catch(() => setMe(null));
  }, []);

  // Poll for results once we have a session
  useEffect(() => {
    if (status !== 'processing' || !sessionId) return;
    const iv = setInterval(async () => {
      try {
        const { data } = await api.get(`/tryon/${sessionId}`);
        if (data.fitted_mesh_path) {
          setStatus('ready');
          clearInterval(iv);
        }
      } catch {
        // not ready yet
      }
    }, 3000);
    return () => clearInterval(iv);
  }, [status, sessionId]);

  const handleUpload = () => {
    if (fileList.length !== 1) {
      return message.error('Please select exactly one video file.');
    }
    setStatus('uploading');
    const form = new FormData();
    form.append('video', fileList[0]);
    api.post('/tryon/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(({ data }) => {
      setSessionId(String(data.sessionId));
      setStatus('processing');
      message.success('Video uploaded! Processing started.');
    }).catch(err => {
      console.error(err);
      setStatus('idle');
      message.error('Upload failed.');
    });
  };

  return (
    <PageLayout title={`Welcome${me ? `, ${me.username}` : ''}!`}>
      {/* === EXISTING STATS CARD === */}
      <Card
        bordered={false}
        style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        extra={
          <Button icon={<LogoutOutlined />} danger onClick={logout}>
            Sign out
          </Button>
        }
      >
        <h2 style={{ marginBottom: 24, fontWeight: 500, fontSize: '1.5rem' }}>
          {`Welcome, ${me?.username ?? 'there'}!`}
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Statistic
              title="Your User ID"
              value={me?.userId ?? '—'}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic
              title="Sample Stat"
              value={42}
              suffix="tasks"
            />
          </Col>
        </Row>
      </Card>

      {/* === TRY‑ON CARD === */}
      <Card title="👗 Try On Your Clothes" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <TryOnResult />
    </Card>
    </PageLayout>
  );
}
