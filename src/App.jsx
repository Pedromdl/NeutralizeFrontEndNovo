import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Logo from './images/logo.png';
import PrivateRoute from './components/PrivateRoute';
import './App.css'; // Certifique-se de ter um CSS para estilizar o layout


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
import SecaoDetalhe from './pages/Usuario/SecaoDetalhe';
import AvaliacaoDetalhe from './pages/Usuario/AvaliacaoDetalhe';
import SessoesDetalhes from './pages/Usuario/SessoesDetalhes';
import SessaoNova from './pages/Usuario/SessaoNova';
import Sessoes from './pages/Usuario/Sessoes';


function LayoutComSidebar({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-area">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        {children}
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  // Verifica se a rota atual é login ou register
  const rotaSemSidebar = ['/login', '/register'].includes(location.pathname);

  if (rotaSemSidebar) {
    // Renderiza só o componente da rota, sem sidebar nem logo
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // Rotas com sidebar e logo
  return (
    <LayoutComSidebar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/avaliacao" element={<Avaliacao />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/orientacao" element={<Orientacao />} />
        <Route path="/configuracoes" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />
        <Route path="/orientacoes/:pastaId/secao/:secaoId" element={<SecaoDetalhe />} />
        <Route path="/avaliacoes/:avaliacaoId" element={<AvaliacaoDetalhe />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/sessoes/nova/:usuarioId" element={<SessaoNova />} />
        <Route path="/sessoes/:sessaoId" element={<SessoesDetalhes />} />
        <Route path="/configuracoes/pre-avaliacoes" element={<PreAvaliacoes />} />
      </Routes>
    </LayoutComSidebar>
  );
}

export default App;
