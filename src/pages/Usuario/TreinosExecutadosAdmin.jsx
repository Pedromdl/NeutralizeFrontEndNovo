import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Search,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Table
} from 'lucide-react';
import Card from '../../components/Card';
import ModalDetalhesTreino from '../../components/ModalDetalhesTreino';
import VisualizacaoTabela from '../../components/VisualizacaoTabela';
import './TreinosExecutadosAdmin.css';

export default function TreinosExecutados() {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [buscaInput, setBuscaInput] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalTreinos, setTotalTreinos] = useState(0);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState('cards'); // 'cards' ou 'tabela'

  const debounceInputRef = useRef(null);
  const debounceRequestRef = useRef(null);

  const navigate = useNavigate();

  // 🔹 Funções auxiliares
  const getNomePaciente = (treino) => {
    return treino.paciente_nome || 'N/A';
  };

  const getNomeTreino = (treino) => {
    return treino.treino_nome || 'N/A';
  };

  const formatarTempo = (segundos) => {
    if (!segundos) return '-';
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}h ${minutos}m ${segs}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${segs}s`;
    } else {
      return `${segs}s`;
    }
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  // 🔹 Effect para ATUALIZAR buscaInput (debounce de 300ms)
  useEffect(() => {
    if (debounceInputRef.current) {
      clearTimeout(debounceInputRef.current);
    }

    debounceInputRef.current = setTimeout(() => {
      setBuscaInput(busca);
      setPaginaAtual(1);
    }, 300);

    return () => {
      if (debounceInputRef.current) {
        clearTimeout(debounceInputRef.current);
      }
    };
  }, [busca]);

  // 🔹 Effect para FAZER REQUISIÇÃO (debounce de 500ms)
  useEffect(() => {
    if (debounceRequestRef.current) {
      clearTimeout(debounceRequestRef.current);
    }

    debounceRequestRef.current = setTimeout(() => {
      const fetchTreinos = async () => {
        try {
          const token = localStorage.getItem('token');

          if (!token) {
            setError('Usuário não autenticado. Faça login novamente.');
            navigate('/login');
            return;
          }

          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          };

          const params = new URLSearchParams({
            page: paginaAtual.toString()
          });

          if (buscaInput) {
            params.append('search', buscaInput);
          }

          setLoading(true);

          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin-treinosexecutados/?${params}`,
            { headers }
          );

          setTreinos(response.data.results);
          setTotalTreinos(response.data.count);
          setTotalPaginas(Math.ceil(response.data.count / 15));

        } catch (err) {
          console.error('Erro detalhado:', err);

          if (err.response?.status === 401) {
            setError('Sessão expirada. Faça login novamente.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setError('Erro ao carregar treinos executados');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchTreinos();
    }, 500);

    return () => {
      if (debounceRequestRef.current) {
        clearTimeout(debounceRequestRef.current);
      }
    };
  }, [navigate, paginaAtual, buscaInput]);

  // 🔹 Handler para input de busca
  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
  };

  // 🔹 Limpar busca
  const limparBusca = () => {
    setBusca('');
    setBuscaInput('');
    setPaginaAtual(1);
  };

  // 🔹 Navegação de páginas
  const irParaPagina = (pagina) => {
    setPaginaAtual(pagina);
  };

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      irParaPagina(paginaAtual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaAtual > 1) {
      irParaPagina(paginaAtual - 1);
    }
  };

  const abrirDetalhes = (treino) => {
    setTreinoSelecionado(treino);
    setModalAberto(true);
  };

  if (error) {
    return (
      <div className="conteudo">
        <Card title="Treinos Executados" size="al">
          <div className="error">{error}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="conteudo">
      <Card title="Treinos Executados" size="al">

        {/* 🔹 Busca Simplificada COM CONTROLES DE VISUALIZAÇÃO */}
        <div className="busca-section-com-controles">
          <div className="busca-wrapper-com-controles">
            <div className="busca-input-com-controles">
              <div className="search-input-wrapper">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar por paciente ou treino..."
                  value={busca}
                  onChange={handleBuscaChange}
                  className="search-input-simple"
                />
                {busca && (
                  <button
                    onClick={limparBusca}
                    className="btn-limpar-busca"
                    title="Limpar busca"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* 🔹 Controles de Visualização - ALINHADO COM O INPUT */}
              <div className="controles-visualizacao-input">
                <button
                  onClick={() => setModoVisualizacao('cards')}
                  className={`btn-modo-compacto ${modoVisualizacao === 'cards' ? 'ativo' : ''}`}
                  title="Visualização em Cards"
                >
                  <Dumbbell size={20} />
                </button>
                <button
                  onClick={() => setModoVisualizacao('tabela')}
                  className={`btn-modo-compacto ${modoVisualizacao === 'tabela' ? 'ativo' : ''}`}
                  title="Visualização em Tabela"
                >
                  <Table size={20} />
                </button>
              </div>
            </div>

            <div className="busca-info">
              <span>
                {loading ? 'Carregando...' : `${treinos.length} de ${totalTreinos} treinos`}
                {buscaInput && ` • Filtrado por: "${buscaInput}"`}
              </span>
            </div>
          </div>
        </div>

        {/* 🔹 Conteúdo Baseado na Visualização Escolhida */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando treinos...</p>
          </div>
        ) : modoVisualizacao === 'cards' ? (
          // 🔹 Visualização em Cards
          <div className="treinos-list">
            {treinos.length === 0 ? (
              <div className="empty-state">
                <Dumbbell size={48} />
                <p>
                  {buscaInput
                    ? `Nenhum treino encontrado para "${buscaInput}"`
                    : 'Nenhum treino executado encontrado'
                  }
                </p>
                {buscaInput && (
                  <button
                    onClick={limparBusca}
                    className="btn-limpar-filtros-link"
                  >
                    Limpar busca para ver todos os treinos
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="treinos-grid-simplificado">
                  {treinos.map(treino => (
                    <div key={treino.id} className="treino-card-simplificado">

                      {/* 🔹 Header com Status */}
                      <div className="treino-header">
                        <div className="treino-status">
                          {treino.finalizado ? (
                            <CheckCircle size={16} className="status-finalizado" />
                          ) : (
                            <XCircle size={16} className="status-pendente" />
                          )}
                          <span className={`status-badge ${treino.finalizado ? 'finalizado' : 'pendente'}`}>
                            {treino.finalizado ? 'Finalizado' : 'Pendente'}
                          </span>
                        </div>
                        <span className="treino-id">#{treino.id}</span>
                      </div>

                      {/* 🔹 Informações Principais */}
                      <div className="treino-info-simplificado">
                        <div className="info-item-simplificado">
                          <User size={18} />
                          <div className="info-content">
                            <span className="info-label">Paciente</span>
                            <span className="info-value">{getNomePaciente(treino)}</span>
                          </div>
                        </div>

                        <div className="info-item-simplificado">
                          <Dumbbell size={18} />
                          <div className="info-content">
                            <span className="info-label">Treino</span>
                            <span className="info-value">{getNomeTreino(treino)}</span>
                          </div>
                        </div>

                        <div className="info-item-simplificado">
                          <Calendar size={18} />
                          <div className="info-content">
                            <span className="info-label">Data</span>
                            <span className="info-value">{formatarData(treino.data)}</span>
                          </div>
                        </div>

                        {treino.finalizado && treino.tempo_total && (
                          <div className="info-item-simplificado">
                            <Clock size={18} />
                            <div className="info-content">
                              <span className="info-label">Tempo</span>
                              <span className="info-value">{formatarTempo(treino.tempo_total)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 🔹 Ações */}
                      <div className="treino-actions-simplificado">
                        <button
                          className="btn-detalhes-simplificado"
                          onClick={() => abrirDetalhes(treino)}
                        >
                          <Eye size={16} />
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 🔹 Paginação - APENAS para cards */}
                {totalPaginas > 1 && (
                  <div className="paginacao">
                    {/* Informação da página - SEMPRE NO TOPO */}
                    <div className="paginacao-superior">
                      <span className="info-paginacao">
                        Página {paginaAtual} de {totalPaginas} • {totalTreinos} treinos no total
                      </span>
                    </div>

                    {/* Botões - UM EM CADA CANTO */}
                    <div className="paginacao-inferior">
                      <button
                        onClick={paginaAnterior}
                        disabled={paginaAtual === 1 || loading}
                        className="btn-paginacao"
                      >
                        <ChevronLeft size={16} />
                        Anterior
                      </button>

                      <button
                        onClick={proximaPagina}
                        disabled={paginaAtual === totalPaginas || loading}
                        className="btn-paginacao"
                      >
                        Próxima
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // 🔹 Visualização em Tabela
          <VisualizacaoTabela
            treinos={treinos}
            onAbrirDetalhes={abrirDetalhes}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            totalTreinos={totalTreinos}
            onMudarPagina={irParaPagina}
            loading={loading}
          />
        )}

        {/* 🔹 Modal de Detalhes */}
        {modalAberto && (
          <ModalDetalhesTreino
            treino={treinoSelecionado}
            onClose={() => setModalAberto(false)}
          />
        )}
      </Card>
    </div>
  );
}