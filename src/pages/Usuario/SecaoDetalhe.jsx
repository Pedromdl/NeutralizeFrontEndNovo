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
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/pastas/${pastaId}/`)
      .then((response) => {
        const pastaEncontrada = response.data;
        const secaoEncontrada = pastaEncontrada.secoes.find(
          (s) => s.id === Number(secaoId)
        );

        if (secaoEncontrada) {
          // Padroniza o campo video_url para videoUrl
          secaoEncontrada.orientacoes = secaoEncontrada.orientacoes.map((o) => ({
            ...o,
            videoUrl: o.video_url || ''
          }));
          setPasta(pastaEncontrada);
          setSecao(secaoEncontrada);
        }

        setCarregando(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error);
        setCarregando(false);
      });
  }, [pastaId, secaoId]);

  // Converte qualquer link do YouTube para o formato embed
  const getEmbedUrl = (url) => {
    if (!url) return '';

    // Shorts
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('/shorts/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Links padrão do YouTube
    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }

    // Links encurtados youtu.be
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }

    // Se já for embed ou outro formato, retorna direto
    return url;
  };

  if (carregando) return <p>Carregando...</p>;
  if (!pasta || !secao) return <p>Seção não encontrada.</p>;

  return (
    <div style={{ padding: 20, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <CardCarrossel
        title={secao.titulo}
        fixedContent={
          <>
            <button
              onClick={() => navigate(-1)}
              style={{ marginBottom: '1rem' }}
            >
              ← Voltar
            </button>
            <h3>{pasta.nome}</h3>
          </>
        }
        carouselContent={secao.orientacoes.map((o) => (
          <div className="carrossel-item" key={o.id}>
            <h4>{o.titulo}</h4>
            <p>
              <strong>Séries:</strong> {o.series}
            </p>
            <p>
              <strong>Repetições:</strong> {o.repeticoes}
            </p>
            {o.descricao && <p>{o.descricao}</p>}
            {o.videoUrl && (
              <iframe
                width="100%"
                height="180"
                src={getEmbedUrl(o.videoUrl)}
                title={o.titulo}
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: '12px' }} // <--- aqui adiciona a borda arredondada

              />
            )}
          </div>
        ))}
      />
    </div>
  );
}
