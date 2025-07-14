import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Card from '../../components/Card';

export default function AvaliacaoDetalhe() {
  const { avaliacaoId } = useParams();
  const navigate = useNavigate();

  const [avaliacao, setAvaliacao] = useState(null);
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const [year, month, day] = dataStr.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/anamnese/${avaliacaoId}/`)
      .then((response) => {
        setAvaliacao(response.data);
        setConteudo(response.data.conteudo_html);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar a avaliação.');
        setLoading(false);
      });
  }, [avaliacaoId]);

  if (loading) return <p>Carregando avaliação...</p>;
  if (error) return <p>{error}</p>;
  if (!avaliacao) return <p>Avaliação não encontrada.</p>;

  const salvar = () => {
    axios.put(`${import.meta.env.VITE_API_URL}/api/anamnese/${avaliacaoId}/`, {
      ...avaliacao,
      conteudo_html: conteudo,
    })
      .then(() => {
        alert('Avaliação salva com sucesso!');
      })
      .catch(() => {
        alert('Erro ao salvar a avaliação.');
      });
  };

const baixarDocx = () => {
  window.open(`${import.meta.env.VITE_API_URL}/api/anamnese/${avaliacaoId}/exportar-docx/`, '_blank');
};

  return (
    <div style={{ padding: 20, minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <Card title={`Avaliação: ${formatarData(avaliacao.data_avaliacao)}`} size="al">
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          ← Voltar
        </button>

        <div>
          <ReactQuill theme="snow" value={conteudo} onChange={setConteudo} />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button onClick={salvar}>
            Salvar
          </button>
          <button onClick={baixarDocx} style={{ marginTop: '1rem', marginLeft: '1rem' }}>
  Baixar DOCX
</button>
        </div>
      </Card>
    </div>
  );
}
