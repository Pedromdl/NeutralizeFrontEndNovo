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

// Função para buscar com autenticação
const fetchComAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const resposta = await fetch(url, {
    ...options,
    headers,
  });

  if (resposta.status === 401) {
    // Token expirado ou inválido
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('usuarioSelecionadoId');
    localStorage.removeItem('abaAtiva');
    
    // Redirecionar para login se estiver em uma página protegida
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Não autorizado');
  }

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
  }

  return resposta;
};

function Usuarios() {
  const location = useLocation();
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // 🔁 Carrega usuário e aba do localStorage primeiro
  useEffect(() => {
    const carregarUsuarioSalvo = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        // Verificar se usuário está autenticado
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setErro('Usuário não autenticado');
          setCarregando(false);
          return;
        }
        
        // 1. Verificar se há um ID na navegação (prioridade mais alta)
        if (location.state?.pacienteId) {
          const id = location.state.pacienteId;
          const response = await fetchComAuth(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}/`);
          const data = await response.json();
          setUsuarioSelecionado(data);
          localStorage.setItem('usuarioSelecionadoId', JSON.stringify(id));
          
          // Definir aba se veio da navegação
          if (location.state?.aba) {
            setAbaAtiva(location.state.aba);
            localStorage.setItem('abaAtiva', location.state.aba);
          } else {
            // Se não tem aba na navegação, tenta carregar do localStorage
            const abaSalva = localStorage.getItem('abaAtiva');
            if (abaSalva) {
              setAbaAtiva(abaSalva);
            } else {
              setAbaAtiva('Dashboard');
              localStorage.setItem('abaAtiva', 'Dashboard');
            }
          }
          setCarregando(false);
          return;
        }
        
        // 2. Se não, verificar localStorage
        const salvoId = localStorage.getItem('usuarioSelecionadoId');
        if (salvoId) {
          try {
            const id = JSON.parse(salvoId);
            const response = await fetchComAuth(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}/`);
            
            if (response.ok) {
              const data = await response.json();
              setUsuarioSelecionado(data);
              
              // Carregar aba salva
              const abaSalva = localStorage.getItem('abaAtiva');
              if (abaSalva) {
                setAbaAtiva(abaSalva);
              } else {
                setAbaAtiva('Dashboard');
                localStorage.setItem('abaAtiva', 'Dashboard');
              }
            }
          } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            if (error.message === 'Não autorizado') {
              setErro('Sessão expirada. Faça login novamente.');
            } else {
              setErro('Erro ao carregar usuário salvo');
            }
            localStorage.removeItem('usuarioSelecionadoId');
          }
        } else {
          // Se não tem usuário salvo, define aba padrão se existir
          const abaSalva = localStorage.getItem('abaAtiva');
          if (abaSalva) {
            setAbaAtiva(abaSalva);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar dados do servidor');
      } finally {
        setCarregando(false);
      }
    };

    carregarUsuarioSalvo();
  }, [location.state]);

  // Salvar aba quando mudar
  useEffect(() => {
    if (abaAtiva) {
      localStorage.setItem('abaAtiva', abaAtiva);
    }
  }, [abaAtiva]);

  const handleSelecionaUsuario = async (usuario) => {
    try {
      // Buscar dados completos do usuário
      const response = await fetchComAuth(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuario.id}/`);
      const dataCompleta = await response.json();
      
      setUsuarioSelecionado(dataCompleta);
      localStorage.setItem('usuarioSelecionadoId', JSON.stringify(usuario.id));
      
      // Se for a primeira vez selecionando um usuário, define Dashboard como aba ativa
      if (!abaAtiva || abaAtiva === '') {
        setAbaAtiva('Dashboard');
        localStorage.setItem('abaAtiva', 'Dashboard');
      }
    } catch (error) {
      console.error('Erro ao selecionar usuário:', error);
      setErro('Erro ao carregar dados do usuário');
    }
  };

  const atualizarUsuario = (novoUsuario) => {
    setUsuarioSelecionado(novoUsuario);
    localStorage.setItem('usuarioSelecionadoId', JSON.stringify(novoUsuario.id));
  };

  const limparUsuarioSelecionado = () => {
    setUsuarioSelecionado(null);
    localStorage.removeItem('usuarioSelecionadoId');
    setAbaAtiva('');
    localStorage.removeItem('abaAtiva');
  };

  // 🧠 Renderiza conteúdo das abas
  const renderConteudoAba = () => {
    if (!usuarioSelecionado) return null;

    switch (abaAtiva) {
      case 'Dashboard':
        return (
          <>
            {/* Botão de gerar relatório PDF */}
            <Card size="usuario">
              <FiltroData
                usuarioId={usuarioSelecionado.id}
                valorSelecionado={dataSelecionada}
                onChange={setDataSelecionada}
              />
              <div className="pdf-button" style={{ marginTop: '12px', fontSize: '12px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
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

            <div className="dashboard-grid">
              {[
                {
                  title: "Força Muscular",
                  comp: <GraficoForca usuarioId={usuarioSelecionado.id} dataSelecionada={dataSelecionada} />,
                  size: "md",
                  gridColumn: "span 12",
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
                  style={{ display: 'contents' }}
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
            <DadosUsuario
              usuarioId={usuarioSelecionado.id}
              atualizarUsuario={atualizarUsuario}
            />
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

      default:
        // Se não tem aba ativa mas tem usuário, mostra Dashboard
        if (usuarioSelecionado && !abaAtiva) {
          setAbaAtiva('Dashboard');
          return null;
        }
        return null;
    }
  };

  if (carregando) {
    return (
      <div className="conteudo">
        <div className="info-cards">
          <Card title="Carregando..." size="md">
            <p>Carregando dados do usuário...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="conteudo">
        <div className="info-cards">
          <Card title="Erro" size="md">
            <p style={{ color: 'red' }}>{erro}</p>
            <button 
              onClick={() => window.location.href = '/login'}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Ir para Login
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="conteudo">
      <div className="info-cards">
        <Card title="Busca de Usuários" size="md">
          <UserSearch onSelect={handleSelecionaUsuario} />
          
          {usuarioSelecionado && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              background: '#f5f5f5', 
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}>
              <div style={{ alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>Usuário atual:</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>{usuarioSelecionado.nome}</p>
                </div>

              </div>
            </div>
          )}
        </Card>

        {usuarioSelecionado && (
          <Card title="Navegação" size="md">
            <div className="toggle-buttons">
              {['Dashboard', 'Dados', 'Orientações', 'Avaliações', 'Sessões'].map((aba) => (
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