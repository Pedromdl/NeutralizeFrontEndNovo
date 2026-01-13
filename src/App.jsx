import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Sidebar from './components/Menus/Sidebar.jsx';
import PacienteSidebar from './components/Menus/PacienteSidebar.jsx';
import BottomMenu from './components/Menus/BottomMenu.jsx';
import PacienteBottomMenu from './components/Menus/PacienteBottomMenu.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import ConsentBanner from './components/ConsentBanner.jsx';
import './App.css';

// Import do Provider da Assinatura
import { AssinaturaProvider } from './context/AssinaturaContext.jsx';
import ProtegidoPorAssinatura from './components/ProtegidoPorAssinatura.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Cadastro from './pages/Cadastro/Cadastro.jsx';
import Register from './pages/Registro/Register.jsx';
import RegistrarClinica from './pages/RegistroClinica/RegistrarClinica.jsx';
import Profile from './pages/Profile.jsx';
import Configuracoes from './pages/Configuracoes.jsx';

import Usuarios from './pages/Usuario/Usuarios.jsx';
import BancoUsuarios from './pages/Usuario/BancoUsuarios.jsx'
import Avaliacao from './pages/Avaliacao/Avaliacao.jsx';
import PreAvaliacoes from './pages/Configuracoes/PreAvaliacoes.jsx';
import PreTestes from './pages/Configuracoes/PreTestes.jsx';
import Agendamentos from './pages/Calendario/Agendamentos.jsx';
import Orientacao from './pages/Usuario/Orientacao.jsx';
import TreinoDetalhe from './pages/Usuario/TreinoDetalhe.jsx';
import PastaDetalhe from './pages/Usuario/PastaDetalhe.jsx';
import SecaoDetalhe from './pages/Usuario/SecaoDetalhe.jsx';
import AvaliacaoDetalhe from './pages/Usuario/AvaliacaoDetalhe.jsx';
import SessoesDetalhes from './pages/Usuario/SessoesDetalhes.jsx';
import SessaoNova from './pages/Usuario/SessaoNova.jsx';
import BancoExercicios from './pages/Usuario/BancoExercicios.jsx';
import DemoBody from './pages/DemoBody.jsx';
import TreinoInterativo from "./components/TreinoInterativo.jsx";
import TreinosExecutadosAdmin from './pages/Usuario/TreinosExecutadosAdmin.jsx';

import OrientacoesPaciente from './pages/Pacientes/OrientacoesPacientes.jsx';
import TreinoInterativoPacientes from './pages/Pacientes/TreinoInterativoPacientes.jsx';
import PainelInicialPaciente from "./pages/Pacientes/PainelInicialPacientes.jsx";
import TreinosSecaoPaciente from './pages/Pacientes/TreinoSecaoPaciente.jsx';
import HistoricodeTreinos from './pages/Pacientes/HistoricodeTreinos.jsx';
import Financeiro from './pages/Financeiro.jsx';
import Teste from './pages/Teste.jsx';
import RelatorioInterativo from './pages/Usuario/RelatorioInterativo.jsx';
import Integracoes from './pages/Integracoes/Integracoes.jsx';
import LiberacaoMiofascial from './pages/LiberacaoMiofascial.jsx';

import AssinaturaInfo from './pages/AssinaturaInfo.jsx';
import TermosUso from "./pages/TermosUso/TermosUso.jsx";
import PoliticaPrivacidade from './pages/PoliticaPrivacidade/PoliticaPrivacidade.jsx';

import ListaPlanos from './components/ListaPlanos.jsx';
import AssinaturaDetalhes from './components/AssinaturaDetalhes.jsx';

import StravaCallback from "./components/StravaCallback.jsx";
import Agenda from "./pages/Agenda/Agenda.jsx"
import Homepage from './pages/Usuario/Homepage.jsx';


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
  const rotasSemLayout = [
    '/login', '/register', '/registro-clinica', '/politica-privacidade',
    '/termos-de-uso', '/teste', '/liberacao-miofascial', '/strava/callback'
  ];

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
        <Route path="/strava/callback" element={<StravaCallback />} />

      </Routes>
    );
  }

  return (
    <PrivateRoute>
      <AssinaturaProvider>
        <LayoutComSidebar>
          <Routes>
            {/* ✅ PÁGINAS SEMPRE LIBERADAS */}
            <Route path="/" element={<Home />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/usuarios" element={<Usuarios />} /> {/* 🔥 AGORA LIBERADA */}
            <Route path="/orientacao" element={<Orientacao />} />
            <Route path="/pastas/:id" element={<PastaDetalhe />} />
            <Route path="/secoes/:id/treino" element={<TreinoDetalhe />} />
            <Route path="/configuracoes" element={<Configuracoes />} /> {/* 🔥 AGORA LIBERADA */}
            <Route path="/orientacoes/:pastaId/secao/:secaoId" element={<SecaoDetalhe />} />
            <Route path="/avaliacoes/:avaliacaoId" element={<AvaliacaoDetalhe />} />
            <Route path="/sessoes/:sessaoId" element={<SessoesDetalhes />} />
            <Route path="/demo" element={<DemoBody />} />
            <Route path="/treinos/:secaoId" element={<TreinoInterativo />} />
            <Route path="/paciente/orientacoes" element={<OrientacoesPaciente />} />
            <Route path="/paciente/treinos/:treinoId" element={<TreinoInterativoPacientes />} />
            <Route path="/paciente" element={<PainelInicialPaciente />} />
            <Route path="/paciente/secao/:secaoId" element={<TreinosSecaoPaciente />} />
            <Route path="/paciente/historico" element={<HistoricodeTreinos />} />
            <Route path="/treinosexecutados" element={<TreinosExecutadosAdmin />} />
            <Route path="/paciente/integracoes" element={<Integracoes />} />

            {/* 🚫 PÁGINAS BLOQUEADAS se trial expirado */}
            <Route
              path="/bancoexercicios"
              element={
                <ProtegidoPorAssinatura>
                  <BancoExercicios />
                </ProtegidoPorAssinatura>
              }
            />
            <Route
              path="/avaliacao"
              element={
                <ProtegidoPorAssinatura>
                  <Avaliacao />
                </ProtegidoPorAssinatura>
              }
            />
            <Route
              path="/cadastro"
              element={
                <ProtegidoPorAssinatura>
                  <Cadastro />
                </ProtegidoPorAssinatura>
              }
            />
            <Route
              path="/agendamentos"
              element={
                <ProtegidoPorAssinatura>
                  <Agendamentos />
                </ProtegidoPorAssinatura>
              }
            />
            <Route
              path="/calendario"
              element={
                <ProtegidoPorAssinatura>
                  <Agenda />
                </ProtegidoPorAssinatura>
              }
            />
            <Route
              path="/sessoes/nova/:usuarioId"
              element={
                <ProtegidoPorAssinatura>
                  <SessaoNova />
                </ProtegidoPorAssinatura>
              }
            />
            <Route
              path="/configuracoes/pre-avaliacoes"
              element={
                <ProtegidoPorAssinatura>
                  <PreAvaliacoes />
                </ProtegidoPorAssinatura>
              }
            />
            <Route
              path="/financeiro"
              element={
                <ProtegidoPorAssinatura>
                  <Financeiro />
                </ProtegidoPorAssinatura>
              }
            />
            <Route
              path="/banco-usuarios"
              element={
                <ProtegidoPorAssinatura>
                  <BancoUsuarios />
                </ProtegidoPorAssinatura>
              }
            />
            <Route
              path="/configuracoes/pre-testes"
              element={
                <ProtegidoPorAssinatura>
                  <PreTestes />
                </ProtegidoPorAssinatura>
              }
            />

            {/* ✅ PÁGINAS DE ASSINATURA SEMPRE LIBERADAS */}
            <Route path="/assinatura-info" element={<AssinaturaInfo />} />
            <Route path="/planos" element={<ListaPlanos />} />
            <Route path="/assinatura" element={<AssinaturaDetalhes />} />
            <Route path="/assinatura/:assinaturaId" element={<AssinaturaDetalhes />} />
          </Routes>
        </LayoutComSidebar>
      </AssinaturaProvider>
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