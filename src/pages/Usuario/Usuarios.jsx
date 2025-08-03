import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import UserSearch from '../../components/UserSearch';
import GraficoProgresso from './GraficoProgresso';
import GraficoForca from '../../components/Dashboard/GraficoForca';
import GraficoMobilidade from '../../components/Dashboard/GraficoMobilidade';
import GraficoTesteFuncao from '../../components/Dashboard/GraficoTestesFuncao';
import GraficoTesteDor from '../../components/Dashboard/GraficoTestesDor';
import GraficoEstabilidade from '../../components/Dashboard/GraficoEstabilidade';
import GraficoEstabilidade2 from '../../components/Dashboard/GraficoEstabilidade2';
import Card from '../../components/Card';
import FiltroData from '../../components/FiltroData';
import DadosUsuario from './DadosUsuario';
import Orientacao from './Orientacao'
import Avaliacoes from './Avaliacoes';
import Sessoes from './Sessoes';


function Usuarios() {
  const location = useLocation(); // 👈 E ISSO
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('');
  

  useEffect(() => {
  const salvo = localStorage.getItem('usuarioSelecionado');
  if (salvo) {
    setUsuarioSelecionado(JSON.parse(salvo));
  }

  if (location.state?.pacienteId) {
    fetch(`${import.meta.env.VITE_API_URL}/api/pacientes/${location.state.pacienteId}/`)
      .then(res => res.json())
      .then(data => {
        setUsuarioSelecionado(data);
        localStorage.setItem('usuarioSelecionado', JSON.stringify(data));
      });
  }

  if (location.state?.aba) {
    setAbaAtiva(location.state.aba);
  } else {
    const abaSalva = localStorage.getItem('abaAtiva');
    if (abaSalva) {
      setAbaAtiva(abaSalva);
    }
  }
}, [location.state]);

useEffect(() => {
  localStorage.setItem('abaAtiva', abaAtiva);
}, [abaAtiva]);

const atualizarUsuario = (novoUsuario) => {
  setUsuarioSelecionado(novoUsuario);
  localStorage.setItem('usuarioSelecionado', JSON.stringify(novoUsuario));
};

  const renderConteudoAba = () => {
    switch (abaAtiva) {
      case 'Dashboard':
        return (
          <>
            <Card title="Filtro de Data" size="al">
              <FiltroData
                usuarioId={usuarioSelecionado.id}
                valorSelecionado={dataSelecionada}
                onChange={setDataSelecionada}
              />
            </Card>

            <div className="dashboard-grid">
              <Card title="Força Muscular" size="md">
                <GraficoForca usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />
              </Card>

              <Card title="Mobilidade" size="md">
                <GraficoMobilidade usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />
              </Card>

              <Card title="Estabilidade" size="lg">
                <div style={{ display: 'flex'}}>
                  <div style={{ flex: 1 }}>
                    <GraficoEstabilidade usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />
                  </div>
                </div>
              </Card>


              <Card title="Dor" size="sm">
                <GraficoTesteDor usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />
              </Card>

              <Card title="Função" size="lg">
                <GraficoTesteFuncao usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />
              </Card>

              
  
            </div>
          </>
        );

      case 'Dados':
        return (
          <div className="card card-al">
            {usuarioSelecionado && (
              <DadosUsuario
                usuarioSelecionado={usuarioSelecionado}
                atualizarUsuario={atualizarUsuario}
              />
            )}
          </div>


        );

      case 'Orientações':
        return (
          <Orientacao usuarioId={usuarioSelecionado.id} />
        );
      case 'Avaliações':
        return <Avaliacoes usuarioId={usuarioSelecionado.id} />;

      case 'Sessões':
        return <Sessoes usuarioId={usuarioSelecionado.id} />;

      case 'Progressão':
        return <GraficoProgresso usuarioId={usuarioSelecionado.id} />;

      default:
        return null;
    }
  };

  const handleSelecionaUsuario = (usuario) => {
  setUsuarioSelecionado(usuario);
  localStorage.setItem('usuarioSelecionado', JSON.stringify(usuario));
};

  return (
    <div className="conteudo">
      {/* Bloco fixo em coluna */}
      <div className="info-cards">
        <Card title="Busca de Usuários" size="md">
          <p>Selecione para ver os gráficos de desempenho.</p>
          <UserSearch onSelect={handleSelecionaUsuario} />
        </Card>

        {usuarioSelecionado && (
          <>
            {/* Toggle de abas */}
            <Card title="Navegação" size="md">
              <div className="toggle-buttons">
                <button onClick={() => setAbaAtiva('Dashboard')} className={abaAtiva === 'Dashboard' ? 'ativo' : ''}>
                  Dashboard
                </button>
                <button onClick={() => setAbaAtiva('Dados')} className={abaAtiva === 'Dados' ? 'ativo' : ''}>
                  Dados
                </button>
                <button onClick={() => setAbaAtiva('Orientações')} className={abaAtiva === 'Orientações' ? 'ativo' : ''}>
                  Orientações
                </button>
                <button onClick={() => setAbaAtiva('Avaliações')} className={abaAtiva === 'Avaliações' ? 'ativo' : ''}>
                  Avaliações
                </button>
                <button onClick={() => setAbaAtiva('Sessões')} className={abaAtiva === 'Sessões' ? 'ativo' : ''}>
                Sessões
              </button>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Conteúdo da aba selecionada */}
      {usuarioSelecionado && renderConteudoAba()}
    </div>
  );
}

export default Usuarios;
