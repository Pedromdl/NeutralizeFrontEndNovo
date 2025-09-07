import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import BottomSheetModal from './BottomSheetModal';
import './css/BottomMenu.css';
import Logo from '../images/logo3.png'; // 🔹 ajuste o caminho da imagem

function BottomMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const irPara = (caminho) => {
    navigate(caminho);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bottom-menu">
        {/* 🔹 Logo à esquerda */}
        <div className="bottom-menu-logo">
          <img src={Logo} alt="Logo" />
        </div>

        <NavLink to="/" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          🏠
          <span>Início</span>
        </NavLink>
        <NavLink to="/usuarios" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          👤
          <span>Usuários</span>
        </NavLink>
        <NavLink to="/avaliacao" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          📊
          <span>Avaliação</span>
        </NavLink>
        <NavLink to="/agendamentos" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          📅
          <span>Agenda</span>
        </NavLink>

        <button className="bottom-menu-extra" onClick={() => setIsOpen(true)}>
          ⚙️
          <span>Configurações</span>
        </button>
      </nav>

      <BottomSheetModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Configurações</h2>
        <ul>
          <li>
            <button onClick={() => irPara('/configuracoes/pre-avaliacoes')}>
              Pré-Avaliações
            </button>
          </li>
          <li>
            <button onClick={() => irPara('/perfil')}>
              Perfil
            </button>
          </li>
          <li>
            <button onClick={() => irPara('/configuracoes/notificacoes')}>
              Notificações
            </button>
          </li>
          <li>
            <button onClick={() => setIsOpen(false)}>Fechar</button>
          </li>
        </ul>
      </BottomSheetModal>
    </>
  );
}

export default BottomMenu;
