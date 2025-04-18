import React, { useContext } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values: {
    email: string;
    username: string;
    password: string;
  }) => {
    console.log('payload→', values)
    try {
      await register(values.email, values.username, values.password);
      navigate('/login');
    } catch (err: any) {
      // You can replace this with your own notification system
      alert(
        err?.response?.data?.message ||
        err.message ||
        'Registration failed'
      );
    }
  };

  return (
    <Card
      title="Create an account"
      style={{ maxWidth: 400, margin: '4rem auto' }}
      bodyStyle={{ padding: '2rem' }}
    >
      <Form
        name="register_form"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Enter a valid email.' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Please input your username!' },
            { min: 3, message: 'Username must be at least 3 characters.' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters.' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            Already have an account?{' '}
            <a onClick={() => navigate('/login')}>Log in</a>
          </div>
        </Form.Item>
      </Form>
      <Button
            block
            icon={<GoogleOutlined />}
            onClick={() => {
            window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
            }}
        >
            Sign in with Google
        </Button>
    </Card>
  );
}
