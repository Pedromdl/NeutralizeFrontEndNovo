import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <p>Carregando...</p>;

  return token ? children : <Navigate to="/login" />;
}
