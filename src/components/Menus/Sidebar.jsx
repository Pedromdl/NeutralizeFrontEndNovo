import { useState, useEffect } from 'react';
import '../css/Sidebar.css';
import { NavLink } from 'react-router-dom';
import Logo from '../../images/logo2.png';

// 🔹 Ícones do lucide-react
import { House, Users, BarChart3, FileText, CalendarDays, Settings } from 'lucide-react';

function Sidebar() {
  const [aberto, setAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar resize para saber se é mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setAberto(!aberto);
  const handleOverlayClick = () => setAberto(false);

  return (
    <>
      {isMobile && aberto && <div className="overlay" onClick={handleOverlayClick}></div>}

      {!aberto && isMobile && (
        <button className="botao-toggle-global" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <div className={`sidebar ${aberto ? 'aberta' : 'fechada'}`}>
        <button className="botao-toggle" onClick={toggleSidebar}>
          {aberto ? '←' : '→'}
        </button>

        {/* 🔹 Logo só aparece quando está aberto */}
        {aberto && (
          <div className="sidebar-logo">
            <img src={Logo} alt="Logo" />
          </div>
        )}

        <ul className="menu">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'ativo' : '')}>
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
            <NavLink to="/agendamentos" className={({ isActive }) => (isActive ? 'ativo' : '')}>
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
