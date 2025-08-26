import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import BottomSheetModal from './BottomSheetModal';
import './css/BottomMenu.css';

function BottomMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const irPara = (caminho) => {
    navigate(caminho);
    setIsOpen(false); // fecha o modal ao navegar
  };

  return (
    <>
      <nav className="bottom-menu">
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

        {/* Botão de Configurações abre o modal */}
        <button
          className="bottom-menu-extra"
          onClick={() => setIsOpen(true)}
        >
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
