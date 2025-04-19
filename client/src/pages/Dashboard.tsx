// client/src/pages/Dashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button, Upload, Space, message, Spin } from 'antd';
import { LogoutOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import PageLayout from '../components/PageLayout';
import TryOn from '../components/TryOn';
import MeshViewer from '../components/MeshViewer';

interface MeResponse {
  userId: number;
  username: string;
}

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    api.get<MeResponse>('/me')
      .then(res => setMe(res.data))
      .catch(() => setMe(null));
  }, []);

  return (
    <PageLayout title={`Welcome${me ? `, ${me.username}` : ''}!`}>

      {/* === EXISTING STATS CARD === */}
      <Card
        bordered={false}
        style={{width: '500px', height: '400px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
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
              title="Number of Clothes Uploaded"
              value={5}
              suffix=" pieces"
            />
          </Col>
        </Row>

          {/* === TRY‑ON CARD === */}
        <Card
          title="👗 Try On Your Clothes"
          bordered={false}
          style={{paddingTop: '40px' ,border: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          <TryOn />
        </Card>
      </Card>

      <MeshViewer modelUrl="\boss-t_ethan_wrapped.obj"/>

    </PageLayout>
  );
}