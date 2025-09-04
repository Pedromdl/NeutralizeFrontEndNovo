import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PacienteSidebar from './components/PacienteSidebar';
import BottomMenu from './components/BottomMenu';
import PacienteBottomMenu from './components/PacienteBottomMenu';
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
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Rotas que NÃO terão sidebar
  const rotasSemSidebar = ['/perfil']; 
  const isNoSidebar = rotasSemSidebar.includes(location.pathname);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isPacienteRoute = location.pathname.startsWith("/paciente");

  return (
    <div className="app-container">
      {/* Renderiza sidebar só se não estiver em rota sem sidebar */}
      {!isMobile && !isNoSidebar && (isPacienteRoute ? <PacienteSidebar /> : <Sidebar />)}

      <div className="main-area">
        {/* Logo sempre visível */}
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>

        {children}

        {/* Bottom menu mobile, exceto nas rotas sem menu */}
        {isMobile && !isNoSidebar && (
          isPacienteRoute ? <PacienteBottomMenu /> : <BottomMenu />
        )}
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  // Rotas públicas sem layout (login/register)
  const rotaSemLayout = ['/login', '/register'];

  if (rotaSemLayout.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // Todas as demais rotas protegidas
  return (
    <PrivateRoute>
      <LayoutComSidebar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/orientacao" element={<Orientacao />} />
          <Route path="/pastas/:id" element={<PastaDetalhe />} />
          <Route path="/secoes/:id/treino" element={<TreinoDetalhe />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
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
    </PrivateRoute>
  );
}


export default App;
