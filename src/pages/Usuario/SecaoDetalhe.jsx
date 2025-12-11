import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CardCarrossel from '../../components/CardCarrossel';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SecaoDetalhe() {
  const { pastaId, secaoId } = useParams();
  const navigate = useNavigate();

  const [pasta, setPasta] = useState(null);
  const [secao, setSecao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError('Seção não encontrada');
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados da seção');
        setLoading(false);
      });
  }, [pastaId, secaoId]);

  // Função getEmbedUrl permanece igual...

  if (loading) {
    return <LoadingSpinner message="Carregando seção..." />;
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f1f5f9',
        padding: '20px'
      }}>
        <div style={{ 
          textAlign: 'center', 
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>{error}</h3>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '10px 20px',
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
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Resto do componente renderizando o conteúdo...
  return (
    <div style={{ padding: 20, backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <CardCarrossel
        title={secao.titulo}
        fixedContent={
          <>
            <button
              onClick={() => navigate(-1)}
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
                style={{ borderRadius: '12px' }}
              />
            )}
          </div>
        ))}
      />
    </div>
  );
}