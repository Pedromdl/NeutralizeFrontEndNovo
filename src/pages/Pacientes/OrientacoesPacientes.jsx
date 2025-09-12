import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';
import { AuthContext } from '../../context/AuthContext';

// -------------------
// Componente Seção
// -------------------
const SecaoItem = React.memo(({ secao, onClickSecao }) => (
  <div
    onClick={() => onClickSecao(secao)}
    style={{
      cursor: 'pointer',
      backgroundColor: '#f0f0f0',
      padding: '1rem',
      borderRadius: '6px',
      marginBottom: '0.5rem',
    }}
  >
    <h3>{secao.titulo}</h3>
  </div>
));

// -------------------
// Componente Pasta
// -------------------
const PastaItem = React.memo(({ pasta, onClickSecao }) => (
  <li style={{ cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
    <h2>{pasta.nome}</h2>
    <div>
      {pasta.secoes.map((secao) => (
        <SecaoItem key={secao.id} secao={secao} onClickSecao={onClickSecao} />
      ))}
    </div>
  </li>
));

// -------------------
// Componente Pai
// -------------------
export default function OrientacoesPaciente() {
  const { user, loading } = useContext(AuthContext);
  const [pastas, setPastas] = useState([]);
  const [pastaSelecionada, setPastaSelecionada] = useState(null);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  // -------------------
  // Função para clicar em uma seção
  // -------------------
  const handleClickSecao = useCallback(
    (secao) => {
      navigate(`/paciente/treinos/${secao.id}`);
    },
    [navigate]
  );

  // -------------------
  // Buscar pastas do paciente
  // -------------------
  useEffect(() => {
    if (!loading) {
      if (!user) {
        setErro('Usuário não autenticado');
        return;
      }

      const source = axios.CancelToken.source();

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/`, {
          cancelToken: source.token,
        })
        .then((res) => setPastas(res.data))
        .catch((err) => {
          if (!axios.isCancel(err)) {
            setErro('Não foi possível carregar as pastas');
          }
        });

      // Cancelar requisição se o componente desmontar
      return () => source.cancel('Componente desmontou');
    }
  }, [user, loading]);

  if (loading) return <Card title="Minhas Orientações" size="al">Carregando...</Card>;
  if (erro) return <Card title="Minhas Orientações" size="al">{erro}</Card>;

  return (
    <div className="conteudo">
      <Card title="Minhas Orientações" size="al">
        {!pastaSelecionada ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pastas.length > 0 ? (
              pastas.map((pasta) => (
                <PastaItem key={pasta.id} pasta={pasta} onClickSecao={handleClickSecao} />
              ))
            ) : (
              <li>Nenhuma pasta encontrada.</li>
            )}
          </ul>
        ) : (
          <>
            <button onClick={() => setPastaSelecionada(null)} style={{ marginBottom: '1rem' }}>
              ← Voltar para pastas
            </button>
            <h2>{pastaSelecionada.nome}</h2>
            {pastaSelecionada.secoes?.map((secao) => (
              <SecaoItem key={secao.id} secao={secao} onClickSecao={handleClickSecao} />
            ))}
          </>
        )}
      </Card>
    </div>
  );
}
