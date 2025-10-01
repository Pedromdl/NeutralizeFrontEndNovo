import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import BottomSheetModal from '../BottomSheetModal';
import '../css/BottomMenu.css';
import Logo from '../../images/logo3.png'; // 🔹 ajuste o caminho da imagem

// 🔹 Ícones do lucide-react
import { House, Users, BarChart3, CalendarDays, Cog, FileText, User, Bell, CircleX } from 'lucide-react';

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
          <House size={20} color="#fff" />
          <span>Início</span>
        </NavLink>

        <NavLink to="/usuarios" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          <Users size={20} color="#fff" />
          <span>Usuários</span>
        </NavLink>

        <NavLink to="/avaliacao" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          <BarChart3 size={20} color="#fff" />
          <span>Avaliação</span>
        </NavLink>

        <NavLink to="/agendamentos" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          <CalendarDays size={20} color="#fff" />
          <span>Agenda</span>
        </NavLink>

        <button className="bottom-menu-extra" onClick={() => setIsOpen(true)}>
          <Cog size={20} color="#fff" />
          <span>Config.</span>
        </button>
      </nav>

      <BottomSheetModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Configurações</h2>
        <ul className="bottomsheet-list">
          <li>
            <button onClick={() => irPara('/configuracoes/pre-avaliacoes')}>
              <FileText size={18} color="#282829" style={{ marginRight: '8px' }} />
              Pré-Avaliações
            </button>
          </li>
          <li>
            <button onClick={() => irPara('/perfil')}>
              <User size={18} color="#282829" style={{ marginRight: '8px' }} /> 
              Perfil
            </button>
          </li>
          <li>
            <button onClick={() => irPara('/configuracoes/notificacoes')}>
              <Bell size={18} color="#282829" style={{ marginRight: '8px' }} />
              Notificações
            </button>
          </li>
          <li>
            <button onClick={() => setIsOpen(false)}>
              <CircleX size={18} color="#282829" style={{ marginRight: '8px' }} />
              Fechar
            </button>
          </li>
        </ul>
      </BottomSheetModal>
    </>
  );
}

export default BottomMenu;
