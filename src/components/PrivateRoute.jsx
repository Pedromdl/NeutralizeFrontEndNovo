import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Importação do componente
import './PrivateRoute.css'; // Mantenha se tiver estilos específicos

const LOADING_TIMEOUT = 9000; // 5 segundos de timeout

export default function PrivateRoute({ children }) {
  const { token, loading } = useContext(AuthContext);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, LOADING_TIMEOUT);

    return () => clearTimeout(timer);
  }, [loading]);

  const handleRetry = () => {
    setIsTimeout(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        size="medium"
        showTimeout={isTimeout}
        timeoutMessage="A verificação de autenticação está demorando mais que o esperado"
        onRetry={handleRetry}
      />
    );
  }

  return token ? children : <Navigate to="/login" />;
}