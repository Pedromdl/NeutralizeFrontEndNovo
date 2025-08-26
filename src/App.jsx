import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomMenu from './components/BottomMenu';
import Logo from './images/logo.png';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Configuracoes from './pages/Configuracoes';
import Usuarios from './pages/Usuario/Usuarios';
import Avaliacao from './pages/Avaliacao';
import PreAvaliacoes from './pages/Configuracoes/PreAvaliacoes';
import Agendamentos from './pages/Calendario/Agendamentos';
import Cadastro from './pages/Cadastro';
import Orientacao from './pages/Usuario/Orientacao';
import TreinoDetalhe from './pages/Usuario/TreinoDetalhe';
import PastaDetalhe from './pages/Usuario/PastaDetalhe';
import SecaoDetalhe from './pages/Usuario/SecaoDetalhe';
import AvaliacaoDetalhe from './pages/Usuario/AvaliacaoDetalhe';
import SessoesDetalhes from './pages/Usuario/SessoesDetalhes';
import SessaoNova from './pages/Usuario/SessaoNova';
import DemoBody from './pages/DemoBody';
import TreinoInterativo from "./components/TreinoInterativo";
import OrientacoesPaciente from './pages/Pacientes/OrientacoesPacientes';
import TreinoInterativoPacientes from './pages/Pacientes/TreinoInterativoPacientes';

import PainelInicialPaciente from "./pages/Pacientes/PainelInicialPacientes";


function LayoutComSidebar({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar só aparece no desktop */}
      {!isMobile && <Sidebar />}
      
      <div className="main-area">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>

        {children}

        {/* BottomMenu só aparece no mobile */}
        {isMobile && <BottomMenu />}
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  // Rotas sem sidebar nem logo
  const rotaSemSidebar = ['/login', '/register'].includes(location.pathname);

  if (rotaSemSidebar) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // Rotas com sidebar, logo e BottomMenu condicional
  return (
    <LayoutComSidebar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/avaliacao" element={<Avaliacao />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/orientacao" element={<Orientacao />} />
        <Route path="/pastas/:id" element={<PastaDetalhe />} />
        <Route path="/secoes/:id/treino" element={<TreinoDetalhe />} />
        <Route path="/configuracoes" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />
        <Route path="/orientacoes/:pastaId/secao/:secaoId" element={<SecaoDetalhe />} />
        <Route path="/avaliacoes/:avaliacaoId" element={<AvaliacaoDetalhe />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/sessoes/nova/:usuarioId" element={<SessaoNova />} />
        <Route path="/sessoes/:sessaoId" element={<SessoesDetalhes />} />
        <Route path="/configuracoes/pre-avaliacoes" element={<PreAvaliacoes />} />
        <Route path="/demo" element={<DemoBody />} />
        <Route path="/treinos/:secaoId" element={<TreinoInterativo />} />
        <Route path="/paciente/orientacoes" element={<OrientacoesPaciente />} />
        <Route path="/paciente/treinos/:secaoId" element={<TreinoInterativoPacientes />} />
        <Route path="/paciente" element={<PainelInicialPaciente />} />

      </Routes>
    </LayoutComSidebar>
  );
}

export default App;
