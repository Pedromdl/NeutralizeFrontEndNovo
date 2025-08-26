import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function OrientacoesPaciente() {
  const { user, loading } = useContext(AuthContext); // pega o paciente logado
  const [pastas, setPastas] = useState([]);
  const [pastaSelecionada, setPastaSelecionada] = useState(null);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setErro('Usuário não autenticado');
        return;
      }

      axios.get(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/?paciente=${user.id}`)
        .then((res) => setPastas(res.data))
        .catch((err) => setErro('Não foi possível carregar as pastas'));
    }
  }, [user, loading]);

  if (loading) return <Card title="Minhas Orientações" size="al">Carregando...</Card>;
  if (erro) return <Card title="Minhas Orientações" size="al">{erro}</Card>;

  return (
    <div className="conteudo">
      <Card title="Minhas Orientações" size="al">
        {!pastaSelecionada ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pastas.length > 0 ? pastas.map((pasta) => (
              <li
              key={pasta.id}
              style={{ cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}
              onClick={() => setPastaSelecionada(pasta)}
            >
              {pasta.nome} ({pasta.secoes?.reduce((total, secao) => total + (secao.orientacoes?.length || 0), 0)} exercícios)
            </li>
          )) : <li>Nenhuma pasta encontrada.</li>}
        </ul>
      ) : (
        <>
          <button onClick={() => setPastaSelecionada(null)} style={{ marginBottom: '1rem' }}>
            ← Voltar para pastas
          </button>
          <h2>{pastaSelecionada.nome}</h2>
          {pastaSelecionada.secoes?.map((secao) => (
            <div
              key={secao.id}
              onClick={() => navigate(`/paciente/treinos/${secao.id}`)}
              style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '6px', marginBottom: '0.5rem' }}
            >
              <h3>{secao.titulo}</h3>
            </div>
          ))}
        </>
      )}
    </Card>
    </div>
  );
}
