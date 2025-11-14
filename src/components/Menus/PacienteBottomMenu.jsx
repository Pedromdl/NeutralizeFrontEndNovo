import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { House, File, Dumbbell, Cog, UserPen, CircleX } from "lucide-react";
import BottomSheetModal from "../BottomSheetModal";
import "../css/BottomMenu.css";
import Logo from '../../images/logo3.png';

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
          to="/paciente"end
          className={({ isActive }) => (isActive ? "ativo" : "")}
        >
          <House size={20} />
          <span>Início</span>
        </NavLink>

        <NavLink
          to="/paciente/orientacoes"
          className={({ isActive }) => (isActive ? "ativo" : "")}
        >
          <File size={20} />
          <span>Orientações</span>
        </NavLink>

        <NavLink
          to="/paciente/historico"
          className={({ isActive }) => (isActive ? "ativo" : "")}
        >
          <Dumbbell size={20} />
          <span>Treinos</span>
        </NavLink>

        <button className="bottom-menu-extra" onClick={() => setIsOpen(true)}>
          <Cog color="#ffff" size={20} />
          <span>Mais</span>
        </button>
      </nav>

      <BottomSheetModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Mais opções</h2>
        <ul>
          <li>
            <button onClick={() => irPara("/perfil")} className="modal-btn">
              <UserPen size={18} style={{ marginRight: '8px' }} />
              Perfil
            </button>
          </li>
          <li>
            <button onClick={() => setIsOpen(false)} className="modal-btn">
              <CircleX size={18} style={{ marginRight: '8px' }} />
              Fechar
            </button>
          </li>
        </ul>
      </BottomSheetModal>
    </>
  );
}

export default PacienteBottomMenu;
