import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import usePastas from '../../hooks/usePastas';
import '../../components/css/Agendamentos.css';
import { usePastasQuery } from '../../hooks/usePastasQuery';


export default function OrientacoesComPastas({ usuarioId }) {
  const navigate = useNavigate();
  const [novoNomePasta, setNovoNomePasta] = useState('');
  const [novoNomeSecao, setNovoNomeSecao] = useState('');

  const {
    pastas,
    pastaSelecionada,
    setPastaSelecionada,
    modalPastaAberto,
    setModalPastaAberto,
    modalSecaoAberto,
    setModalSecaoAberto,
    criarPasta,
    criarSecao,
  } = usePastas(usuarioId);

  // 🔹 Navegação
  const entrarNaPasta = (pasta) => navigate(`/pastas/${pasta.id}`, { state: { usuarioId } });
  const voltarLista = () => setPastaSelecionada(null);
  const abrirSecao = (secaoId) => navigate(`/pastas/${secaoId}`);

  // 🔹 Handlers para modais
  const handleCriarPasta = () => {
    if (!novoNomePasta.trim()) return;
    criarPasta(novoNomePasta);
    setNovoNomePasta('');
    setModalPastaAberto(false);
  };

  const handleCriarSecao = () => {
    if (!novoNomeSecao.trim() || !pastaSelecionada) return;
    criarSecao({ pastaId: pastaSelecionada.id, titulo: novoNomeSecao });
    setNovoNomeSecao('');
    setModalSecaoAberto(false);
  };

  return (
    <Card title="Orientações do Paciente" size="al">
      {!pastaSelecionada ? (
        <>
          <button className="black" onClick={() => setModalPastaAberto(true)}>
            + Criar Pasta
          </button>
          

          {modalPastaAberto && (
            <div style={modalStyle}>
              <div style={modalContentStyle}>
                <h3>Criar Nova Pasta</h3>
                <input
                  className="input"
                  type="text"
                  value={novoNomePasta}
                  onChange={(e) => setNovoNomePasta(e.target.value)}
                  placeholder="Nome da pasta"
                />
                <div style={modalButtonGroupStyle}>
                  <button onClick={() => setModalPastaAberto(false)}>Cancelar</button>
                  <button onClick={handleCriarPasta}>Salvar</button>
                </div>
              </div>
            </div>
          )}

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pastas.map((pasta) => (
              <li
                key={pasta.id}
                style={pastaItemStyle}
                onClick={() => entrarNaPasta(pasta)}
              >
                {pasta.nome}
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

          <button
            onClick={() => setModalSecaoAberto(true)}
            style={{ marginBottom: '1rem' }}
          >
            + Criar Seção
          </button>

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
                  <button onClick={handleCriarSecao}>Salvar</button>
                </div>
              </div>
            </div>
          )}

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
  display: 'flex',
  flexDirection: 'column',
};
const modalButtonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' };
const pastaItemStyle = { cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid #ddd' };
const secaoItemStyle = {
  cursor: 'pointer',
  backgroundColor: '#f0f0f0',
  padding: '1rem',
  borderRadius: '6px',
  marginBottom: '0.5rem',
};
const inputStyle = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '100%',
};
