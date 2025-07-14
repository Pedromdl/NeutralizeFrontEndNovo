import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CardCarrossel from '../../components/CardCarrossel';

export default function SecaoDetalhe() {
  const { pastaId, secaoId } = useParams();
  const navigate = useNavigate();

  const [pasta, setPasta] = useState(null);
  const [secao, setSecao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/pastas/${pastaId}/`) // busca a pasta específica
      .then((response) => {
        const pastaEncontrada = response.data;
        const secaoEncontrada = pastaEncontrada.secoes.find(s => s.id === Number(secaoId));
        setPasta(pastaEncontrada);
        setSecao(secaoEncontrada);
        setCarregando(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error);
        setCarregando(false);
      });
  }, [pastaId, secaoId]);

  if (carregando) return <p>Carregando...</p>;
  if (!pasta || !secao) return <p>Seção não encontrada.</p>;

  return (
    <div style={{ padding: 20, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <CardCarrossel 
        title={secao.titulo}
        fixedContent={
          <>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>← Voltar</button>
            <h3>{pasta.nome}</h3>
          </>
        }
        carouselContent={secao.orientacoes.map(o => (
          <div className="carrossel-item" key={o.id}>
            <h4>{o.titulo}</h4>
            <p><strong>Séries:</strong> {o.series}</p>
            <p><strong>Repetições:</strong> {o.repeticoes}</p>
            {o.descricao && <p>{o.descricao}</p>}
            <iframe
              width="100%"
              height="180"
              src={o.videoUrl.replace('watch?v=', 'embed/')}
              title={o.titulo}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ))}
      />
    </div>
  );
}
