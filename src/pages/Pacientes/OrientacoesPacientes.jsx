import { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';

function Secao({ secao, onClick }) {
  return (
    <div
      onClick={() => onClick(secao)}
      style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '6px', marginBottom: '0.5rem' }}
    >
      <h3>{secao.titulo}</h3>
      {/* Renderize orientações apenas quando necessário */}
      {secao.orientacoes?.length > 0 && (
        <ul>
          {secao.orientacoes.map((o) => (
            <li key={o.id}>{o.titulo}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function OrientacoesPaciente() {
  const { user, loading } = useContext(AuthContext);
  const [pastas, setPastas] = useState([]);
  const [pastaSelecionada, setPastaSelecionada] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      const source = axios.CancelToken.source();

      axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/`, {
        cancelToken: source.token,
      })
      .then(res => setPastas(res.data))
      .catch(err => {
        if (!axios.isCancel(err)) setErro('Não foi possível carregar as pastas');
      });

      return () => source.cancel('Component unmounted');
    }
  }, [user, loading]);

  // Pré-processa dados grandes fora do render
  const pastasRender = useMemo(() => {
    return pastas.map((pasta) => ({
      ...pasta,
      secoes: pasta.secoes || [],
    }));
  }, [pastas]);

  if (loading) return <Card title="Minhas Orientações" size="al">Carregando...</Card>;
  if (erro) return <Card title="Minhas Orientações" size="al">{erro}</Card>;

  return (
    <div className="conteudo">
      <Card title="Minhas Orientações" size="al">
        {!pastaSelecionada ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pastasRender.length > 0 ? pastasRender.map((pasta) => (
              <li key={pasta.id} style={{ cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}
                  onClick={() => setPastaSelecionada(pasta)}>
                {pasta.nome}
              </li>
            )) : <li>Nenhuma pasta encontrada.</li>}
          </ul>
        ) : (
          <>
            <button onClick={() => setPastaSelecionada(null)} style={{ marginBottom: '1rem' }}>
              ← Voltar para pastas
            </button>
            <h2>{pastaSelecionada.nome}</h2>
            {pastaSelecionada.secoes.map(secao => (
              <Secao key={secao.id} secao={secao} onClick={() => {}} />
            ))}
          </>
        )}
      </Card>
    </div>
  );
}
