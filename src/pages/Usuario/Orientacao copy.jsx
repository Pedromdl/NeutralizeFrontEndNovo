import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';

export default function OrientacoesComPastas({ usuarioId }) {
  const [pastas, setPastas] = useState([]);
  const [pastaSelecionada, setPastaSelecionada] = useState(null);
  const [modalPastaAberto, setModalPastaAberto] = useState(false);
  const [modalSecaoAberto, setModalSecaoAberto] = useState(false);
  const [novoNomePasta, setNovoNomePasta] = useState('');
  const [novoNomeSecao, setNovoNomeSecao] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (usuarioId) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/?paciente=${usuarioId}`)
        .then((res) => setPastas(res.data))
        .catch((err) => console.error('Erro ao carregar pastas:', err));
    }
  }, [usuarioId]);

  const entrarNaPasta = (pasta) => setPastaSelecionada(pasta);
  const voltarLista = () => setPastaSelecionada(null);
  const abrirSecao = (secaoId) => navigate(`/treinos/${secaoId}`);

  // Criar pasta
  const criarPasta = async () => {
    if (!novoNomePasta.trim()) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/pastas/`, {
        paciente: usuarioId,
        nome: novoNomePasta,
      });
      setPastas([...pastas, response.data]);
      setNovoNomePasta('');
      setModalPastaAberto(false);
    } catch (err) {
      console.error('Erro ao criar pasta:', err);
    }
  };

  // Criar seção dentro da pasta selecionada
  const criarSecao = async () => {
    if (!novoNomeSecao.trim() || !pastaSelecionada) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orientacoes/secoes/`, {
        pasta: pastaSelecionada.id,
        titulo: novoNomeSecao,
      });
      // Atualiza a pasta selecionada com a nova seção
      setPastaSelecionada({
        ...pastaSelecionada,
        secoes: [...(pastaSelecionada.secoes || []), response.data],
      });
      // Também atualiza a lista geral de pastas
      setPastas(pastas.map(p => p.id === pastaSelecionada.id ? { ...p, secoes: [...(p.secoes || []), response.data] } : p));
      setNovoNomeSecao('');
      setModalSecaoAberto(false);
    } catch (err) {
      console.error('Erro ao criar seção:', err);
    }
  };

  return (
    <Card title="Orientações do Paciente" size="al">
      {!pastaSelecionada ? (
        <>
          {/* Botão para abrir modal de pasta */}
          <button onClick={() => setModalPastaAberto(true)} style={{ marginBottom: '1rem' }}>
            + Criar Pasta
          </button>

          {/* Modal Criar Pasta */}
          {modalPastaAberto && (
            <div style={modalStyle}>
              <div style={modalContentStyle}>
                <h3>Criar Nova Pasta</h3>
                <input
                  type="text"
                  value={novoNomePasta}
                  onChange={(e) => setNovoNomePasta(e.target.value)}
                  placeholder="Nome da pasta"
                  style={inputStyle}
                />
                <div style={modalButtonGroupStyle}>
                  <button onClick={() => setModalPastaAberto(false)}>Cancelar</button>
                  <button onClick={criarPasta}>Salvar</button>
                </div>
              </div>
            </div>
          )}

          {/* Listagem de pastas */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pastas.map((pasta) => (
              <li
                key={pasta.id}
                style={pastaItemStyle}
                onClick={() => entrarNaPasta(pasta)}
              >
                {pasta.nome} (
                {pasta.secoes?.reduce(
                  (total, secao) => total + (secao.treinos?.length || 0),
                  0
                )}{' '}
                treinos)
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <button onClick={voltarLista} style={{ marginBottom: '1rem' }}>
            ← Voltar para pastas
          </button>
          <h2>{pastaSelecionada.nome}</h2>

          {/* Botão para criar seção */}
          <button onClick={() => setModalSecaoAberto(true)} style={{ marginBottom: '1rem' }}>
            + Criar Seção
          </button>

          {/* Modal Criar Seção */}
          {modalSecaoAberto && (
            <div style={modalStyle}>
              <div style={modalContentStyle}>
                <h3>Criar Nova Seção</h3>
                <input
                  type="text"
                  value={novoNomeSecao}
                  onChange={(e) => setNovoNomeSecao(e.target.value)}
                  placeholder="Nome da seção"
                  style={inputStyle}
                />
                <div style={modalButtonGroupStyle}>
                  <button onClick={() => setModalSecaoAberto(false)}>Cancelar</button>
                  <button onClick={criarSecao}>Salvar</button>
                </div>
              </div>
            </div>
          )}

          {/* Listagem de seções */}
          {pastaSelecionada.secoes?.map((secao) => (
            <div
              key={secao.id}
              onClick={() => abrirSecao(secao.id)}
              style={secaoItemStyle}
            >
              <h3>{secao.titulo}</h3>
            </div>
          ))}
        </>
      )}
    </Card>
  );
}

// ======= Estilos =======
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const modalContentStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  minWidth: '300px',
};
const inputStyle = { width: '100%', padding: '0.5rem', marginBottom: '1rem' };
const modalButtonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' };
const pastaItemStyle = { cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid #ddd' };
const secaoItemStyle = { cursor: 'pointer', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '6px', marginBottom: '0.5rem' };
