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
  FileText, 
  User, 
  Bell, 
  CircleX,
  ClipboardList,
  Dumbbell,
  History,
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
      title: "Pré-Avaliações",
      description: "Modelos de avaliações físicas",
      icon: <FileText size={20} color="#282829" />,
      path: '/configuracoes/pre-avaliacoes',
    },
    {
      title: "Testes Pré-Padronizados",
      description: "Configure testes e protocolos",
      icon: <ClipboardList size={20} color="#282829" />,
      path: '/configuracoes/testes-pre-padronizados',
    },
    {
      title: "Banco de Exercícios",
      description: "Biblioteca de exercícios",
      icon: <Dumbbell size={20} color="#282829" />,
      path: '/bancoexercicios',
    },
    {
      title: "Treinos Executados",
      description: "Visualize treinos realizados",
      icon: <History size={20} color="#282829" />,
      path: '/treinosexecutados',
    },
    {
      title: "Integrações",
      description: "Conecte com outras plataformas",
      icon: <Link size={20} color="#282829" />,
      path: '/integracoes',
    },
        {
      title: "Usuários",
      description: "Gerencie usuários da clínica",
      icon: <Users size={20} color="#282829" />,
      path: '/banco-usuarios',
    },
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