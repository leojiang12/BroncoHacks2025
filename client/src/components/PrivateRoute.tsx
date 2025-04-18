import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function PrivateRoute({
  children
}: {
  children: React.ReactElement;
}) {
  const auth = useContext(AuthContext);
  if (!(auth as any)?.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
