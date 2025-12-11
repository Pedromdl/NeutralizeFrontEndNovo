import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner'; // Importando o componente

export default function PastaDetalhe() {
  const { id } = useParams(); // id da pasta
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioId = location.state?.usuarioId; // ✅ pega o paciente selecionado
  const [pasta, setPasta] = useState(null);
  const [novaSecao, setNovaSecao] = useState('');
  const [secaoCriada, setSecaoCriada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (!usuarioId) {
      setError('Nenhum paciente selecionado');
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsTimeout(true);
    }, 5000);

    axios.get(`${import.meta.env.VITE_API_URL}/api/pastas/${id}/?paciente=${usuarioId}`)
      .then(res => {
        setPasta(res.data);
        setLoading(false);
        setIsTimeout(false);
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao carregar pasta');
        setLoading(false);
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => clearTimeout(timeoutId);
  }, [id, usuarioId]);

  const criarSecao = async () => {
    if (!novaSecao.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/secoes/`, {
        pasta: pasta.id,
        titulo: novaSecao,
      });
      setPasta({
        ...pasta,
        secoes: [...(pasta.secoes || []), response.data]
      });
      setSecaoCriada(response.data);
      setNovaSecao('');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar seção');
    }
  };

  const excluirSecao = async (secaoId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta seção?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/secoes/${secaoId}/`);
      setPasta({
        ...pasta,
        secoes: pasta.secoes.filter(secao => secao.id !== secaoId)
      });
      if (secaoCriada?.id === secaoId) setSecaoCriada(null);
    } catch (err) {
      console.error('Erro ao excluir seção:', err);
      alert('Erro ao excluir seção');
    }
  };

  const editarSecao = (secaoId) => {
    navigate(`/secoes/${secaoId}/treino`);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setIsTimeout(false);
    
    axios.get(`${import.meta.env.VITE_API_URL}/api/pastas/${id}/?paciente=${usuarioId}`)
      .then(res => {
        setPasta(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao carregar pasta');
        setLoading(false);
      });
  };

  // Estado de loading com timeout
  if (loading) {
    return (
      <LoadingSpinner
        message="Carregando pasta..."
        showTimeout={isTimeout}
        timeoutMessage="Carregamento da pasta está demorando mais que o esperado"
        onRetry={handleRetry}
        size="medium"
      />
    );
  }

  // Estado de erro
  if (error) {
    return (
      <LoadingSpinner
        message={error}
        showTimeout={true}
        timeoutMessage={error}
        onRetry={handleRetry}
        size="medium"
      />
    );
  }

  // Verifica se pasta existe
  if (!pasta) {
    return (
      <LoadingSpinner
        message="Pasta não encontrada"
        showTimeout={true}
        timeoutMessage="A pasta solicitada não existe ou você não tem permissão para acessá-la"
        onRetry={() => navigate(-1)}
        size="medium"
      />
    );
  }

  return (
    <div className="conteudo">
      <div className="info-cards">
        <Card title={`Pasta: ${pasta.nome}`} size="md">
          <div className="user-search">
            <input
              className="input"
              type="text"
              value={novaSecao}
              onChange={(e) => setNovaSecao(e.target.value)}
              placeholder="Nome da nova seção"
            />
          </div>
          <button onClick={criarSecao}>Salvar Seção</button>
        </Card>
      </div>

      <div className="info-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pasta.secoes?.map(secao => (
          <Card key={secao.id} title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{secao.titulo}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{ background: 'transparent', border: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => editarSecao(secao.id)}
                >
                  Editar
                </button>
                <button
                  style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => excluirSecao(secao.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          }>
          </Card>
        ))}
        
        {(!pasta.secoes || pasta.secoes.length === 0) && (
          <Card title="Nenhuma seção encontrada">
            <p style={{ textAlign: 'center', color: '#666' }}>
              Crie sua primeira seção usando o campo acima
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}