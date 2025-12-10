import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './PrivateRoute.css';

const LOADING_TIMEOUT = 5000; // 5 segundos de timeout

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Carregando...</p>
        </div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" />;
}
