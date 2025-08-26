// ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Carregando...</p>; // enquanto verifica token
  if (!user) return <Navigate to="/login" />; // redireciona se não estiver logado

  return children; // se estiver logado, renderiza o componente
}