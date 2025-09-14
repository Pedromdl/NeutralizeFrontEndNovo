import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';

export default function OrientacoesPaciente() {
  const { user, loading } = useContext(AuthContext); // pega o paciente logado
  const [pastas, setPastas] = useState([]);
  const [pastaSelecionada, setPastaSelecionada] = useState(null);
  const [erro, setErro] = useState(null);

useEffect(() => {
  if (loading) return;

  if (!user) {
    setErro('Usuário não autenticado');
    return;
  }

  const controller = new AbortController();
  let ativo = true;

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/`, {
      signal: controller.signal,
    })
    .then((res) => {
      if (ativo) setPastas(res.data);
    })
    .catch((err) => {
      if (err.name === 'CanceledError') {
        console.log('Requisição cancelada /pastas');
      } else {
        setErro('Não foi possível carregar as pastas');
      }
    });

  // cleanup → roda quando troca de página ou desmonta
  return () => {
    ativo = false;
    controller.abort();
  };
}, [user, loading]);


  if (loading)
    return <Card title="Minhas Orientações" size="al">Carregando...</Card>;
  if (erro)
    return <Card title="Minhas Orientações" size="al">{erro}</Card>;

  return (
    <div className="conteudo">
      <Card title="Minhas Orientações" size="al">
        {!pastaSelecionada ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pastas.length > 0 ? pastas.map((pasta) => (
              <li
                key={pasta.id}
                style={{
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #ddd',
                }}
                onClick={() => setPastaSelecionada(pasta)}
              >
                {pasta.nome}
              </li>
            )) : <li>Nenhuma pasta encontrada.</li>}
          </ul>
        ) : (
          <>
            <button
              onClick={() => setPastaSelecionada(null)}
              style={{ marginBottom: '1rem' }}
            >
              ← Voltar para pastas
            </button>
            <h2>{pastaSelecionada.nome}</h2>
            {pastaSelecionada.secoes?.map((secao) => (
              <Link
                key={secao.id}
                to={`/paciente/treinos/${secao.id}`} // 👈 redirecionamento direto
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: '#f0f0f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <h3>{secao.titulo}</h3>
              </Link>
            ))}
          </>
        )}
      </Card>
    </div>
  );
}
