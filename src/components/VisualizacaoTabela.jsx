import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
} from 'lucide-react';
import ModalDetalhesTreino from './ModalDetalhesTreino';

export default function VisualizacaoTabela({ 
  treinos, 
  onAbrirDetalhes,
  paginaAtual,
  totalPaginas,
  totalTreinos,
  onMudarPagina,
  loading = false,
}) {
  const [ordenacao, setOrdenacao] = useState({ campo: null, direcao: 'asc' });
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  // 🔹 Funções auxiliares
  const getNomePaciente = (treino) => treino.paciente_nome || 'N/A';
  const getNomeTreino = (treino) => treino.treino_nome || 'N/A';

  const formatarTempo = (segundos) => {
    if (!segundos) return '-';
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 64;
    
    if (horas > 0) return `${horas}h ${minutos}m ${segs}s`;
    if (minutos > 0) return `${minutos}m ${segs}s`;
    return `${segs}s`;
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  // 🔹 Ordenação (sem filtros)
  const treinosOrdenados = useMemo(() => {
    const treinosCopy = [...treinos];
    
    if (ordenacao.campo) {
      treinosCopy.sort((a, b) => {
        let valorA, valorB;
        
        switch (ordenacao.campo) {
          case 'paciente':
            valorA = getNomePaciente(a).toLowerCase();
            valorB = getNomePaciente(b).toLowerCase();
            break;
          case 'treino':
            valorA = getNomeTreino(a).toLowerCase();
            valorB = getNomeTreino(b).toLowerCase();
            break;
          case 'data':
            valorA = new Date(a.data);
            valorB = new Date(b.data);
            break;
          case 'tempo':
            valorA = a.tempo_total || 0;
            valorB = b.tempo_total || 0;
            break;
          case 'status':
            valorA = a.finalizado;
            valorB = b.finalizado;
            break;
          default:
            return 0;
        }

        if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return treinosCopy;
  }, [treinos, ordenacao]);

  // 🔹 Handler para ordenação
  const handleOrdenar = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 🔹 Handler para abrir detalhes
  const handleAbrirDetalhes = (treino) => {
    setTreinoSelecionado(treino);
    setModalAberto(true);
  };

  // 🔹 Navegação de páginas
  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      onMudarPagina(paginaAtual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaAtual > 1) {
      onMudarPagina(paginaAtual - 1);
    }
  };

  const getIconeOrdenacao = (campo) => {
    if (ordenacao.campo !== campo) return null;
    return ordenacao.direcao === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="visualizacao-tabela">
      {/* 🔹 Tabela */}
      <div className="tabela-container">
        <table className="tabela-treinos">
          <thead>
            <tr>
              <th 
                onClick={() => handleOrdenar('paciente')}
                className="coluna-ordenavel"
              >
                <span>
                  Paciente {getIconeOrdenacao('paciente')}
                </span>
              </th>
              <th 
                onClick={() => handleOrdenar('treino')}
                className="coluna-ordenavel"
              >
                <span>
                  Treino {getIconeOrdenacao('treino')}
                </span>
              </th>
              <th 
                onClick={() => handleOrdenar('data')}
                className="coluna-ordenavel"
              >
                <span>
                  Data {getIconeOrdenacao('data')}
                </span>
              </th>
              <th 
                onClick={() => handleOrdenar('tempo')}
                className="coluna-ordenavel"
              >
                <span>
                  Tempo {getIconeOrdenacao('tempo')}
                </span>
              </th>
              <th 
                onClick={() => handleOrdenar('status')}
                className="coluna-ordenavel"
              >
                <span>
                  Status {getIconeOrdenacao('status')}
                </span>
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {treinosOrdenados.length === 0 ? (
              <tr>
                <td colSpan="6" className="tabela-vazia">
                  <div className="empty-state">
                    <User size={32} />
                    <p>Nenhum treino encontrado</p>
                  </div>
                </td>
              </tr>
            ) : (
              treinosOrdenados.map(treino => (
                <tr key={treino.id} className="linha-treino">
                  <td>
                    <div className="celula-paciente">
                      <User size={16} />
                      <span>{getNomePaciente(treino)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="celula-treino">
                      <Dumbbell size={16} />
                      <span>{getNomeTreino(treino)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="celula-data">
                      <Calendar size={16} />
                      <span>{formatarData(treino.data)}</span>
                    </div>
                  </td>
                  <td>
                    {treino.finalizado && treino.tempo_total ? (
                      <div className="celula-tempo">
                        <Clock size={16} />
                        <span>{formatarTempo(treino.tempo_total)}</span>
                      </div>
                    ) : (
                      <span className="texto-secundario">-</span>
                    )}
                  </td>
                  <td>
                    <div className={`status-badge ${treino.finalizado ? 'finalizado' : 'pendente'}`}>
                      {treino.finalizado ? (
                        <>
                          <CheckCircle size={14} />
                          Finalizado
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          Pendente
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleAbrirDetalhes(treino)}
                      className="btn-detalhes-tabela"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Paginação */}
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
          disabled={paginaAtual === 1 || loading} // 🔹 AGORA loading está disponível
          className="btn-paginacao"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>

        <button
          onClick={proximaPagina}
          disabled={paginaAtual === totalPaginas || loading} // 🔹 AGORA loading está disponível
          className="btn-paginacao"
        >
          Próxima
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )}

      {/* 🔹 Modal de Detalhes */}
      {modalAberto && (
        <ModalDetalhesTreino 
          treino={treinoSelecionado}
          onClose={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}