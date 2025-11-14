import { useState, useEffect } from 'react';
import '../css/Sidebar.css';
import { NavLink } from 'react-router-dom';

// 🔹 Ícones lucide-react
import { House, File, Dumbbell, UserPen } from 'lucide-react';

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

      {!aberto && isMobile && (
        <button className="botao-toggle-global" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <div className={`sidebar ${aberto ? 'aberta' : 'fechada'}`}>
        <button className="botao-toggle" onClick={toggleSidebar}>
          {aberto ? '←' : '→'}
        </button>

        <ul className="menu">
          <li>
            <NavLink
              to="/paciente"end
              className={({ isActive }) => (isActive ? 'ativo' : '')}
            >
              <House size={20} />
              {aberto && <span>Início</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/paciente/orientacoes"
              className={({ isActive }) => (isActive ? 'ativo' : '')}
            >
              <File size={20} />
              {aberto && <span>Orientações</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/paciente/historico"
              className={({ isActive }) => (isActive ? 'ativo' : '')}
            >
              <Dumbbell size={20} />
              {aberto && <span>Treinos</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/perfil"
              className={({ isActive }) => (isActive ? 'ativo' : '')}
            >
              <UserPen size={20} />
              {aberto && <span>Perfil</span>}
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default PacienteSidebar;
