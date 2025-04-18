import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      }}
    >
      <Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}
