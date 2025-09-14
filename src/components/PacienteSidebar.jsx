import { useState, useEffect } from 'react';
import './css/Sidebar.css';
import { NavLink } from 'react-router-dom';

function PacienteSidebar() {
  const [aberto, setAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar resize para saber se é mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setAberto(!aberto);

  // Fechar sidebar ao clicar no overlay
  const handleOverlayClick = () => setAberto(false);

  return (
    <>
      {isMobile && aberto && (
        <div className="overlay" onClick={handleOverlayClick}></div>
      )}

      {!aberto && window.innerWidth <= 768 && (
        <button className="botao-toggle-global" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <div className={`sidebar ${aberto ? 'aberta' : 'fechada'}`}>
        <button className="botao-toggle" onClick={toggleSidebar}>
          {aberto ? '←' : '→'}
        </button>

        {aberto && (
          <ul className="menu">
            <li>
              <NavLink
                to="/paciente"
                className={({ isActive }) => (isActive ? 'ativo' : '')}
              >
                🏠 <span>Início</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/paciente/orientacoes"
                className={({ isActive }) => (isActive ? 'ativo' : '')}
              >
                📖 <span>Orientações</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/paciente/treinos/1"
                className={({ isActive }) => (isActive ? 'ativo' : '')}
              >
                💪 <span>Treinos</span>
              </NavLink>
            </li>
                        <li>
              <NavLink to="/perfil" className={({ isActive }) => (isActive ? 'ativo' : '')}>
                👤 <span>Perfil</span>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </>
  );
}

export default PacienteSidebar;
