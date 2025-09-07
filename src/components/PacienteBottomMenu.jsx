import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BottomSheetModal from "./BottomSheetModal";
import "./css/BottomMenu.css";
import Logo from '../images/logo3.png'; // 🔹 ajuste o caminho da imagem


function PacienteBottomMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const irPara = (caminho) => {
    navigate(caminho);
    setIsOpen(false);
  };

  return (
    <>
    
      <nav className="bottom-menu">

                <div className="bottom-menu-logo">
                  <img src={Logo} alt="Logo" />
                </div>

        <NavLink
          to="/paciente"
          className={({ isActive }) => (isActive ? "ativo" : "")}
        >
          🏠
          <span>Início</span>
        </NavLink>

        <NavLink
          to="/paciente/orientacoes"
          className={({ isActive }) => (isActive ? "ativo" : "")}
        >
          📖
          <span>Orientações</span>
        </NavLink>

        <NavLink
          to="/paciente/treinos/1"
          className={({ isActive }) => (isActive ? "ativo" : "")}
        >
          💪
          <span>Treinos</span>
        </NavLink>

        {/* Menu extra opcional (Configurações do paciente, por exemplo) */}
        <button className="bottom-menu-extra" onClick={() => setIsOpen(true)}>
          ⚙️
          <span>Mais</span>
        </button>
      </nav>

      <BottomSheetModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Mais opções</h2>
        <ul>
          <li>
            <button onClick={() => irPara("/perfil")}>Perfil</button>
          </li>
          <li>
            <button onClick={() => setIsOpen(false)}>Fechar</button>
          </li>
        </ul>
      </BottomSheetModal>
    </>
  );
}

export default PacienteBottomMenu;
