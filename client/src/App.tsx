import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Home                    from './pages/Home';
import LoginPage               from './pages/LoginPage';
import RegisterPage            from './pages/RegisterPage';
import Dashboard               from './pages/Dashboard';
import PageLayout              from './components/PageLayout';
import VerifyEmail             from './pages/VerifyEmail';
import OAuth2RedirectHandler   from './pages/OAuth2RedirectHandler';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = React.useContext(AuthContext)!;
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PageLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* handle OAuth and email‑verify before catch‑all */}
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/verify-email"    element={<VerifyEmail />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}
