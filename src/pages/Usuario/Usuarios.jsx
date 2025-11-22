import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import UserSearch from '../../components/UserSearch';
import GraficoProgresso from './GraficoProgresso';
import GraficoForca from '../../components/Dashboard/GraficoForca';
import GraficoMobilidade from '../../components/Dashboard/GraficoMobilidade';
import GraficoTesteFuncao from '../../components/Dashboard/GraficoTestesFuncao';
import GraficoTesteDor from '../../components/Dashboard/GraficoTestesDor';
import GraficoEstabilidade from '../../components/Dashboard/GraficoEstabilidade';
import Card from '../../components/Card';
import FiltroData from '../../components/Dashboard/FiltroData';
import DadosUsuario from './DadosUsuario';
import Orientacao from './Orientacao';
import Avaliacoes from './Avaliacoes';
import Sessoes from './Sessoes';
import GerarRelatorio from '../../components/GerarRelatorio';
import VisualizarRelatorioInterativo from '../../components/RelatorioInterativo/VisualizarRelatorioInterativo';


// 🌈 Animações padrão
const containerAnimacao = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

function Usuarios() {
  const location = useLocation();
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('');

  // 🔁 Carrega usuário e aba salvos
  useEffect(() => {
    const salvo = localStorage.getItem('usuarioSelecionado');
    if (salvo) setUsuarioSelecionado(JSON.parse(salvo));

    if (location.state?.pacienteId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${location.state.pacienteId}/`)
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
      if (abaSalva) setAbaAtiva(abaSalva);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem('abaAtiva', abaAtiva);
  }, [abaAtiva]);

  const atualizarUsuario = (novoUsuario) => {
    setUsuarioSelecionado(novoUsuario);
    localStorage.setItem('usuarioSelecionado', JSON.stringify(novoUsuario));
  };

  // 🧠 Renderiza conteúdo das abas
  const renderConteudoAba = () => {
    switch (abaAtiva) {
      case 'Dashboard':
        return (
          <>
          
          {/* Botão de gerar relatório PDF */}
            {usuarioSelecionado && (
            <Card size="al">
              <FiltroData
                usuarioId={usuarioSelecionado.id}
                valorSelecionado={dataSelecionada}
                onChange={setDataSelecionada}
              />
              <div className="pdf-button" style={{ marginTop: '12px', fontSize: '12px' }}>
              <GerarRelatorio
                usuarioId={usuarioSelecionado.id}
                dataSelecionada={dataSelecionada}
              />
              <VisualizarRelatorioInterativo
                usuarioId={usuarioSelecionado.id}
                dataSelecionada={dataSelecionada}
              />
              </div>
            </Card>

            )}

            <div className="dashboard-grid">
              {[
                {
                  title: "Força Muscular",
                  comp: <GraficoForca usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />,
                  size: "md",
                  gridColumn: "span 12", // exemplo — ajuste conforme seu layout
                },
                {
                  title: "Mobilidade",
                  comp: <GraficoMobilidade usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />,
                  size: "md",
                  gridColumn: "span 12",
                },
                {
                  title: "Estabilidade",
                  comp: <GraficoEstabilidade usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />,
                  size: "lg",
                  gridColumn: "span 7",
                },
                {
                  title: "Dor",
                  comp: <GraficoTesteDor usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />,
                  size: "sm",
                  gridColumn: "span 5",
                },
                {
                  title: "Função",
                  comp: <GraficoTesteFuncao usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />,
                  size: "lg",
                  gridColumn: "span 8",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  style={{ display: 'contents' }} // 👈 mantém o comportamento do grid intacto
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                >
                  <Card
                    title={item.title}
                    size={item.size}
                    className={`grid-item ${item.size}`}
                  >
                    {item.comp}
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        );

      case 'Dados':
        return (
          <motion.div {...containerAnimacao}>
            {usuarioSelecionado && (
              <DadosUsuario
                usuarioSelecionado={usuarioSelecionado}
                atualizarUsuario={atualizarUsuario}
              />
            )}
          </motion.div>
        );

      case 'Orientações':
        return (
          <motion.div {...containerAnimacao}>
            <Orientacao usuarioId={usuarioSelecionado.id} />
          </motion.div>
        );

      case 'Avaliações':
        return (
          <motion.div {...containerAnimacao}>
            <Avaliacoes usuarioId={usuarioSelecionado.id} />
          </motion.div>
        );

      case 'Sessões':
        return (
          <motion.div {...containerAnimacao}>
            <Sessoes usuarioId={usuarioSelecionado.id} />
          </motion.div>
        );

      case 'Progressão':
        return (
          <motion.div {...containerAnimacao}>
            <GraficoProgresso usuarioId={usuarioSelecionado.id} />
          </motion.div>
        );

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
      <div className="info-cards">
        <Card title="Busca de Usuários" size="md">
          <p>Selecione para ver os gráficos de desempenho.</p>
          <UserSearch onSelect={handleSelecionaUsuario} />
        </Card>

        {usuarioSelecionado && (
          <Card title="Navegação" size="md">
            <div className="toggle-buttons">
              {['Dashboard', 'Dados', 'Orientações', 'Avaliações', 'Sessões', 'Progressão'].map((aba) => (
                <button
                  key={aba}
                  onClick={() => setAbaAtiva(aba)}
                  className={abaAtiva === aba ? 'ativo' : ''}
                >
                  {aba}
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Conteúdo da aba com transição suave */}
      <AnimatePresence mode="wait">
        {usuarioSelecionado && (
          <motion.div
            key={abaAtiva}
            {...containerAnimacao}
            style={{ width: '100%' }}
          >
            {renderConteudoAba()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Usuarios;