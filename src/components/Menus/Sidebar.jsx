import { useState, useEffect, useContext } from 'react';
import '../css/Sidebar.css';
import { NavLink } from 'react-router-dom';
import LogoFallback from '../../images/logo2.png';

// 🔹 Ícones
import {
  House,
  Users,
  BarChart3,
  FileText,
  CalendarDays,
  Settings,
} from 'lucide-react';

// 🔹 Auth
import { AuthContext } from '../../context/AuthContext';

function Sidebar() {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
  }, [user]);

  const [aberto, setAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setAberto(!aberto);
  const handleOverlayClick = () => setAberto(false);

  if (loading) return null;

  // 🔹 Logo dinâmica da organização
  const logoUrl =
    user?.organizacao?.logo_url || LogoFallback;

  return (
    <>
      {isMobile && aberto && (
        <div className="overlay" onClick={handleOverlayClick} />
      )}

      {!aberto && isMobile && (
        <button className="botao-toggle-global" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <div className={`sidebar ${aberto ? 'aberta' : 'fechada'}`}>
        <button className="botao-toggle" onClick={toggleSidebar}>
          {aberto ? '←' : '→'}
        </button>

        {aberto && (
          <div className="sidebar-logo">
            <img
              src={logoUrl || LogoFallback}
              alt="Logo da organização"
              onError={(e) => {
                e.currentTarget.src = LogoFallback;
              }}
            />
          </div>
        )}

        <ul className="menu">
          <li>
            <NavLink to="/homepage" className={({ isActive }) => (isActive ? 'ativo' : '')}>
              <House size={20} />
              {aberto && <span>Início</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/usuarios" className={({ isActive }) => (isActive ? 'ativo' : '')}>
              <Users size={20} />
              {aberto && <span>Usuários</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/avaliacao" className={({ isActive }) => (isActive ? 'ativo' : '')}>
              <BarChart3 size={20} />
              {aberto && <span>Avaliação</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/cadastro" className={({ isActive }) => (isActive ? 'ativo' : '')}>
              <FileText size={20} />
              {aberto && <span>Cadastro</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/calendario" className={({ isActive }) => (isActive ? 'ativo' : '')}>
              <CalendarDays size={20} />
              {aberto && <span>Agenda</span>}
            </NavLink>
          </li>

          <li>
            <NavLink to="/configuracoes" className={({ isActive }) => (isActive ? 'ativo' : '')}>
              <Settings size={20} />
              {aberto && <span>Configurações</span>}
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
