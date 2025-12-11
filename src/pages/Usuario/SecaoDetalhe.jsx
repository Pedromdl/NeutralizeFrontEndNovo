import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CardCarrossel from '../../components/CardCarrossel';
import LoadingSpinner from '../../components/LoadingSpinner'; // Importar o componente

export default function SecaoDetalhe() {
  const { pastaId, secaoId } = useParams();
  const navigate = useNavigate();

  const [pasta, setPasta] = useState(null);
  const [secao, setSecao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

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
        } else {
          setErro('Seção não encontrada nesta pasta');
        }

        setCarregando(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar dados da seção');
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

  const handleRetry = () => {
    setCarregando(true);
    setErro(null);
    
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/pastas/${pastaId}/`)
      .then((response) => {
        const pastaEncontrada = response.data;
        const secaoEncontrada = pastaEncontrada.secoes.find(
          (s) => s.id === Number(secaoId)
        );

        if (secaoEncontrada) {
          secaoEncontrada.orientacoes = secaoEncontrada.orientacoes.map((o) => ({
            ...o,
            videoUrl: o.video_url || ''
          }));
          setPasta(pastaEncontrada);
          setSecao(secaoEncontrada);
        } else {
          setErro('Seção não encontrada nesta pasta');
        }

        setCarregando(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar dados da seção');
        setCarregando(false);
      });
  };

  const handleVoltar = () => {
    navigate(-1);
  };


  // Estado de loading com timeout
  if (loading) {
    return (
      <LoadingSpinner
        message="Carregando seção..."
        showTimeout={isTimeout}
        timeoutMessage="Carregamento da seção está demorando mais que o esperado"
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

  // Seção não encontrada
  if (!pasta || !secao) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        padding: '20px'
      }}>
        <div style={{ 
          textAlign: 'center', 
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>
            Seção não encontrada
          </h3>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            A seção que você está procurando não existe ou foi removida.
          </p>
          <button
            onClick={handleVoltar}
            style={{
              padding: '12px 24px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              width: '100%'
            }}
          >
            ← Voltar para a lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <CardCarrossel
        title={secao.titulo}
        fixedContent={
          <>
            <button
              onClick={handleVoltar}
              style={{ 
                marginBottom: '1rem',
                padding: '8px 16px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Voltar
            </button>
            <h3 style={{ margin: '0', color: '#333' }}>{pasta.nome}</h3>
          </>
        }
        carouselContent={secao.orientacoes.map((o) => (
          <div 
            className="carrossel-item" 
            key={o.id}
            style={{ 
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>{o.titulo}</h4>
            <p style={{ margin: '4px 0', color: '#666' }}>
              <strong>Séries:</strong> {o.series}
            </p>
            <p style={{ margin: '4px 0', color: '#666' }}>
              <strong>Repetições:</strong> {o.repeticoes}
            </p>
            {o.descricao && (
              <p style={{ 
                margin: '12px 0', 
                color: '#555', 
                lineHeight: '1.5',
                fontSize: '14px'
              }}>
                {o.descricao}
              </p>
            )}
            {o.videoUrl && (
              <div style={{ marginTop: '16px' }}>
                <iframe
                  width="100%"
                  height="180"
                  src={getEmbedUrl(o.videoUrl)}
                  title={o.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ 
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      />
    </div>
  );
}