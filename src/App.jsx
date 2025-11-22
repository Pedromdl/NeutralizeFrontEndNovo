import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Sidebar from './components/Menus/Sidebar';
import PacienteSidebar from './components/Menus/PacienteSidebar';
import BottomMenu from './components/Menus/BottomMenu';
import PacienteBottomMenu from './components/Menus/PacienteBottomMenu';
import PrivateRoute from './components/PrivateRoute';
import ConsentBanner from './components/ConsentBanner.jsx';
import './App.css';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegistrarClinica from './pages/RegistrarClinica.jsx';
import Profile from './pages/Profile';
import Configuracoes from './pages/Configuracoes';


import Usuarios from './pages/Usuario/Usuarios';
import BancoUsuarios from './pages/Usuario/BancoUsuarios'
import Avaliacao from './pages/Avaliacao';
import PreAvaliacoes from './pages/Configuracoes/PreAvaliacoes';
import PreTestes from './pages/Configuracoes/PreTestes';
import Agendamentos from './pages/Calendario/Agendamentos';
import Cadastro from './pages/Cadastro';
import Orientacao from './pages/Usuario/Orientacao';
import TreinoDetalhe from './pages/Usuario/TreinoDetalhe';
import PastaDetalhe from './pages/Usuario/PastaDetalhe';
import SecaoDetalhe from './pages/Usuario/SecaoDetalhe';
import AvaliacaoDetalhe from './pages/Usuario/AvaliacaoDetalhe';
import SessoesDetalhes from './pages/Usuario/SessoesDetalhes';
import SessaoNova from './pages/Usuario/SessaoNova';
import BancoExercicios from './pages/Usuario/BancoExercicios';
import DemoBody from './pages/DemoBody';
import TreinoInterativo from "./components/TreinoInterativo";
import TreinosExecutadosAdmin from './pages/Usuario/TreinosExecutadosAdmin';


import OrientacoesPaciente from './pages/Pacientes/OrientacoesPacientes';
import TreinoInterativoPacientes from './pages/Pacientes/TreinoInterativoPacientes';
import PainelInicialPaciente from "./pages/Pacientes/PainelInicialPacientes";
import TreinosSecaoPaciente from './pages/Pacientes/TreinoSecaoPaciente';
import HistoricodeTreinos from './pages/Pacientes/HistoricodeTreinos';
import Financeiro from './pages/Financeiro';
import Teste from './pages/Teste';
import RelatorioInterativo from './pages/RelatorioInterativo';
import Integracoes from './pages/Integracoes/Integracoes';
import LiberacaoMiofascial from './pages/LiberacaoMiofascial';


import TermosUso from "./pages/TermosUso";
import PoliticaPrivacidade from './pages/PoliticaPrivacidade';


function LayoutComSidebar({ children }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
      {!isMobile && !isNoSidebar && (isPacienteRoute ? <PacienteSidebar /> : <Sidebar />)}
      {isMobile && !isNoSidebar && (isPacienteRoute ? <PacienteBottomMenu /> : <BottomMenu />)}

      <div className="main-area">
        <div className="logo-container"></div>
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  // Em vez de lista simples:
  const rotasSemLayout = ['/login', '/register', '/registro-clinica', '/politica-privacidade', '/termos-de-uso', `/teste`, '/liberacao-miofascial'  // nova rota pública
  ];

  // Adicione uma verificação dinâmica para rotas como /relatorio/:usuarioId
  const isTesteRoute = location.pathname.startsWith('/relatorio/');

  if (rotasSemLayout.includes(location.pathname) || isTesteRoute) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registro-clinica" element={<RegistrarClinica />} />

        <Route path="/teste" element={<Teste />} />
        <Route path="/relatorio/:token" element={<RelatorioInterativo />} />
        <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/termos-de-uso" element={<TermosUso />} />
        <Route path="/liberacao-miofascial" element={<LiberacaoMiofascial />} />
      </Routes>
    );
  }

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
          <Route path="/paciente/treinos/:treinoId" element={<TreinoInterativoPacientes />} />
          <Route path="/paciente" element={<PainelInicialPaciente />} />
          <Route path="/paciente/secao/:secaoId" element={<TreinosSecaoPaciente />} />
          <Route path="/paciente/historico" element={<HistoricodeTreinos />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/bancoexercicios" element={<BancoExercicios />} />
          <Route path="/banco-usuarios" element={<BancoUsuarios />} />
          <Route path="/integracoes" element={<Integracoes />} />
          <Route path="/treinosexecutados" element={<TreinosExecutadosAdmin />} />
          <Route path="/pre-testes" element={<PreTestes />} />

        </Routes>
      </LayoutComSidebar>
    </PrivateRoute>
  );
}

function App() {
  return (
    <>

      <ConsentBanner />
      <AppRoutes />

    </>
  );
}

export default App;
