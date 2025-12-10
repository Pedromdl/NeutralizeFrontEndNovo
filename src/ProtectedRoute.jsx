// ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import './ProtectedRoute.css';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="protected-route-container">
        <div className="loading-card">
          <div className="spinner-wrapper">
            <Loader2 size={48} className="spinner-animation" />
          </div>
          <div className="loading-content">
            <h2>Verificando autenticação</h2>
            <p>Estamos verificando suas credenciais de acesso...</p>
            <div className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  return children;
}