// client/src/pages/LoginPage.tsx
import React, { useContext } from 'react';
import { Form, Input, Button, Checkbox, Space, Card } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <Card
      title="Sign In"
      style={{ maxWidth: 400, margin: '4rem auto' }}
      bodyStyle={{ padding: '2rem' }}
    >

      <Form
        name="login"
        layout="vertical"
        size="large"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="you@example.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log In
          </Button>
        </Form.Item>

        <Form.Item>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ justifyContent: 'center', width: '100%' }}>
              <span>Or</span>
              <a onClick={() => navigate('/register')}>Register now</a>
            </Space>
            <Button
              block
              icon={<GoogleOutlined />}
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
              }}
            >
              Sign in with Google
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
