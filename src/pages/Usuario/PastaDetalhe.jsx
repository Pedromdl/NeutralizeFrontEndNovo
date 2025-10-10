import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';

export default function PastaDetalhe() {
  const { id } = useParams(); // id da pasta
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioId = location.state?.usuarioId; // ✅ pega o paciente selecionado
  const [pasta, setPasta] = useState(null);
  const [novaSecao, setNovaSecao] = useState('');
  const [secaoCriada, setSecaoCriada] = useState(null);

  useEffect(() => {
    if (!usuarioId) return; // evita requisição sem paciente
    axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/${id}/?paciente=${usuarioId}`)
      .then(res => setPasta(res.data))
      .catch(err => console.error(err));
  }, [id, usuarioId]);

  const criarSecao = async () => {
    if (!novaSecao.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/secoes/`, {
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
    }
  };

  const excluirSecao = async (secaoId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta seção?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orientacoes/secoes/${secaoId}/`);
      setPasta({
        ...pasta,
        secoes: pasta.secoes.filter(secao => secao.id !== secaoId)
      });
      if (secaoCriada?.id === secaoId) setSecaoCriada(null);
    } catch (err) {
      console.error('Erro ao excluir seção:', err);
    }
  };

  const editarSecao = (secaoId) => {
    navigate(`/secoes/${secaoId}/treino`);
  };

  if (!pasta) return <p>Carregando...</p>;

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
      </div>
    </div>
  );
}
