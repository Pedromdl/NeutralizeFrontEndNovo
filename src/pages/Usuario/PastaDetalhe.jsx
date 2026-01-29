import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Edit2, Trash2, Save, X, Plus } from 'lucide-react';

export default function PastaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioId = location.state?.usuarioId;

  const [pasta, setPasta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTimeout, setIsTimeout] = useState(false);

  const [editandoPasta, setEditandoPasta] = useState(false);
  const [novoNomePasta, setNovoNomePasta] = useState('');

  useEffect(() => {
    if (!usuarioId) {
      setError('Nenhum paciente selecionado');
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => setIsTimeout(true), 5000);

    axios.get(`${import.meta.env.VITE_API_URL}/api/pastas/${id}/?paciente=${usuarioId}`)
      .then(res => {
        setPasta(res.data);
        setNovoNomePasta(res.data.nome);
        setLoading(false);
        setIsTimeout(false);
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao carregar pasta');
        setLoading(false);
      })
      .finally(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, [id, usuarioId]);

  const salvarNomePasta = async () => {
    if (!novoNomePasta.trim()) return;
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/pastas/${pasta.id}/`, { nome: novoNomePasta });
      setPasta(res.data);
      setEditandoPasta(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o nome da pasta');
    }
  };

  // =====================
  // Adicionar Seção Inline
  // =====================
  const adicionarSecaoInline = () => {
    const novaSecaoTemp = {
      id: `temp-${Date.now()}`, // ID temporário
      titulo: '',
      editing: true,
      isTemp: true
    };
    setPasta(prev => ({
      ...prev,
      secoes: [novaSecaoTemp, ...(prev.secoes || [])]
    }));
  };

  const salvarSecaoInline = async (secao) => {
    if (!secao.titulo.trim()) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/secoes/`, {
        pasta: pasta.id,
        titulo: secao.titulo
      });

      setPasta(prev => ({
        ...prev,
        secoes: prev.secoes.map(s => s.id === secao.id ? response.data : s)
      }));
    } catch (err) {
      console.error(err);
      alert('Erro ao criar seção');
    }
  };

  const excluirSecao = async (secaoId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta seção?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/secoes/${secaoId}/`);
      setPasta(prev => ({
        ...prev,
        secoes: prev.secoes.filter(s => s.id !== secaoId)
      }));
    } catch (err) {
      console.error('Erro ao excluir seção:', err);
      alert('Erro ao excluir seção');
    }
  };

  const editarSecao = (secaoId) => {
    navigate(`/secoes/${secaoId}/treino`);
  };

  const atualizarNomeSecao = async (secao) => {
    if (!secao.titulo.trim()) return

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/secoes/${secao.id}/`,
        { titulo: secao.titulo }
      )

      setPasta(prev => ({
        ...prev,
        secoes: prev.secoes.map(s =>
          s.id === secao.id
            ? { ...res.data, editing: false }
            : s
        )
      }))
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar seção')
    }
  }


  // =====================
  // Render
  // =====================
  if (loading) return <LoadingSpinner message="Carregando pasta..." showTimeout={isTimeout} timeoutMessage="Carregamento demorando..." onRetry={() => window.location.reload()} size="medium" />;
  if (error) return <LoadingSpinner message={error} showTimeout={true} timeoutMessage={error} onRetry={() => window.location.reload()} size="medium" />;
  if (!pasta) return <LoadingSpinner message="Pasta não encontrada" showTimeout={true} timeoutMessage="Não existe" onRetry={() => navigate(-1)} size="medium" />;

  return (
    <div className="conteudo">
      <div className="info-cards">
        <Card title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editandoPasta ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  value={novoNomePasta}
                  onChange={(e) => setNovoNomePasta(e.target.value)}
                  style={{ fontSize: '1rem', padding: '0.25rem 0.5rem' }}
                />
                <button onClick={salvarNomePasta} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <Save size={18} />
                </button>
                <button onClick={() => setEditandoPasta(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <X size={18}  />
                </button>
              </div>
            ) : (
              <>
                <span>{pasta.nome}</span>
                <button onClick={() => setEditandoPasta(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <Edit2 size={18} />
                </button>
              </>
            )}
          </div>
        } size="md">
          <button onClick={adicionarSecaoInline} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Plus size={16} /> Adicionar Seção
          </button>
        </Card>
      </div>

      <div className="info-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pasta.secoes?.map(secao => (
          <Card
            key={secao.id}
            title={
              secao.editing ? (
                <input
                  autoFocus
                  value={secao.titulo}
                  onChange={(e) => {
                    const novoValor = e.target.value
                    setPasta(prev => ({
                      ...prev,
                      secoes: prev.secoes.map(s =>
                        s.id === secao.id ? { ...s, titulo: novoValor } : s
                      )
                    }))
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (secao.isTemp) {
                        salvarSecaoInline(secao) // cria
                      } else {
                        atualizarNomeSecao(secao) // edita
                      }
                    }
                    if (e.key === 'Escape') {
                      setPasta(prev => ({
                        ...prev,
                        secoes: prev.secoes.filter(s => s.id !== secao.id)
                      }))
                    }
                  }}
                  placeholder="Editar nome da seção"
                  style={{
                    width: '100%',
                    fontSize: '1rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {/* 🔹 TÍTULO CLICÁVEL */}
                  <span
                    onClick={() => editarSecao(secao.id)}
                    style={{
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                    title="Abrir seção"
                  >
                    {secao.titulo}
                  </span>

                  {/* 🔹 AÇÕES */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      title="Editar nome"
                      onClick={() => {
                        setPasta(prev => ({
                          ...prev,
                          secoes: prev.secoes.map(s =>
                            s.id === secao.id
                              ? { ...s, editing: true }
                              : s
                          )
                        }))
                      }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <Edit2 size={18}  />
                    </button>

                    <button
                      title="Excluir seção"
                      onClick={() => excluirSecao(secao.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            }
          />

        ))}

        {(!pasta.secoes || pasta.secoes.length === 0) && !pasta.secoes?.some(s => s.editing) && (
          <Card title="Nenhuma seção encontrada">
            <p style={{ textAlign: 'center', color: '#666' }}>
              Crie sua primeira seção usando o botão acima
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
