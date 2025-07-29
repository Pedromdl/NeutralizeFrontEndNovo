import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Usuarios from './pages/Usuario/Usuarios';
import Avaliacao from './pages/Avaliacao';
import Agendamentos from './pages/Agendamentos';
import Cadastro from './pages/Cadastro';
import Sidebar from './components/Sidebar';
import Orientacao from './pages/Usuario/Orientacao';
import SecaoDetalhe from './pages/Usuario/SecaoDetalhe';
import AvaliacaoDetalhe from './pages/Usuario/AvaliacaoDetalhe';
import SessoesDetalhes from './pages/Usuario/SessoesDetalhes';
import Sessoes from './pages/Usuario/Sessoes';

import './App.css';
import Logo from './images/logo.png';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-area">

        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/orientacao" element={<Orientacao />} />
          <Route path="/orientacoes/:pastaId/secao/:secaoId" element={<SecaoDetalhe />} />
          <Route path="/avaliacoes/:avaliacaoId" element={<AvaliacaoDetalhe />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/sessoes/:sessaoId" element={<SessoesDetalhes />} />


        </Routes>
      </div>
    </div>
  );
}

export default App;
