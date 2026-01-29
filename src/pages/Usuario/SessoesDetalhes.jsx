import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Card from '../../components/Card';

export default function SessaoDetalhe() {
  const { sessaoId } = useParams();
  const navigate = useNavigate();

  const [sessao, setSessao] = useState(null);
  const [conteudo, setConteudo] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessao = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessoes/${sessaoId}/`);
        if (!response.ok) throw new Error('Sessão não encontrada.');

        const data = await response.json();
        setSessao(data);
        setConteudo(data.descricao || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessao();
  }, [sessaoId]);

  const salvar = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessoes/${sessaoId}/`, {
        method: 'PATCH', // ou PUT se for sobrescrever tudo
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descricao: conteudo }),
      });

      if (!response.ok) throw new Error('Erro ao salvar sessão.');

      alert('Sessão salva com sucesso!');
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    }
  };

  const formatarData = (dataStr) => {
    const [year, month, day] = dataStr.split('-');
    return `${day}/${month}/${year}`;
  };

  if (loading) return <p>Carregando sessão...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20, minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <Card title={`Sessão: ${formatarData(sessao.data)}`} size="al">


        <h3>{sessao.titulo}</h3>

        <ReactQuill theme="snow" value={conteudo} onChange={setConteudo} />

        <div style={{ marginTop: '1rem', justifySelf: 'right', display: 'flex', gap: '1rem' }}>
          <button onClick={salvar}>Salvar</button>
          <button onClick={() => navigate(-1)}>
            ← Voltar
          </button>
        </div>
      </Card>
    </div>
  );
}
