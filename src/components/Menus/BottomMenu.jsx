import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import BottomSheetModal from '../BottomSheetModal';
import '../css/BottomMenu.css';
import Logo from '../../images/logo3.png';

// 🔹 Ícones do lucide-react
import {
  House,
  Users,
  BarChart3,
  CalendarDays,
  Cog,
  User,
  CircleX,
  Link
} from 'lucide-react';

function BottomMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const irPara = (caminho) => {
    navigate(caminho);
    setIsOpen(false);
  };

  // 🔹 Lista de opções do menu de configurações
  const configItems = [
    {
      title: "Dados da Conta",
      description: "Informações pessoais",
      icon: <User size={20} color="#282829" />,
      path: '/perfil',
    },

  ];

  return (
    <>
      <nav className="bottom-menu">
        {/* 🔹 Logo à esquerda */}
        <div className="bottom-menu-logo">
          <img src={Logo} alt="Logo" />
        </div>

        <NavLink to="/homepage" className={({ isActive }) => (isActive ? 'ativo' : '')}>
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

        <NavLink to="/calendario" className={({ isActive }) => (isActive ? 'ativo' : '')}>
          <CalendarDays size={20} color="#fff" />
          <span>Agenda</span>
        </NavLink>

        <button className="bottom-menu-extra" onClick={() => setIsOpen(true)}>
          <Cog size={20} color="#fff" />
          <span>Config.</span>
        </button>
      </nav>

      <BottomSheetModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="bottomsheet-configuracoes">
          <h2>Configurações</h2>
          <p className="bottomsheet-subtitle">
            Gerencie as configurações do sistema
          </p>

          <ul className="bottomsheet-list">
            {configItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => irPara(item.path)}
                  className="config-menu-btn"
                >
                  <div className="config-btn-content">
                    <div className="config-btn-icon">
                      {item.icon}
                    </div>
                    <div className="config-btn-text">
                      <span className="config-btn-title">{item.title}</span>
                      <span className="config-btn-description">{item.description}</span>
                    </div>
                  </div>
                </button>
              </li>
            ))}

            {/* 🔹 Botão Fechar */}
            <li className="fechar-item">
              <button onClick={() => setIsOpen(false)} className="fechar-btn">
                <CircleX size={20} color="#282829" />
                <span>Fechar</span>
              </button>
            </li>
          </ul>
        </div>
      </BottomSheetModal>
    </>
  );
}

export default BottomMenu;