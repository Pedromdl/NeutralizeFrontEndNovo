import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VisualizarRelatorioInterativo({ usuarioId }) {
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const gerarRelatorio = async () => {
    setCarregando(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/gerar-relatorio/${usuarioId}/`
      );
      const token = res.data.url.split('/').filter(Boolean).pop();
      navigate(`/relatorio/${token}`);
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <button
      onClick={gerarRelatorio}
      className="bg-blue-500 text-white px-4 py-2 rounded"
      disabled={carregando}
    >
      {carregando ? 'Gerando relatório...' : 'Gerar Relatório Público'}
    </button>
  );
}
