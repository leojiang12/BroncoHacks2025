// client/src/pages/Dashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import PageLayout from '../components/PageLayout';

interface MeResponse {
      userId:   number;
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
    </PageLayout>
  );
}
