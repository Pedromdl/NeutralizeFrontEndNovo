import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Card from '../../components/Card';

export default function SessaoNova() {
  const { usuarioId } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessoes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paciente: usuarioId,
          data,
          titulo,
          descricao,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar sessão');
      }

      const novaSessao = await response.json();

navigate('/usuarios', {
  state: {
    pacienteId: usuarioId, // id do paciente
    aba: 'Sessões',         // aba para ativar
  },
});
    } catch (error) {
      console.error(error);
      alert('Não foi possível criar a sessão');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div style={{ padding: 20, minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <Card title="Nova Sessão" size="al">
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          ← Voltar
        </button>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', display: 'flex',justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <div>
              <label>Título:</label><br />
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                style={{
                  width: '200px',
                  padding: '0.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '10px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <div>
              <label>Data:</label><br />
              <input
                type="date"
                value={data}
                onChange={e => setData(e.target.value)}
                required
                min={new Date().toISOString().slice(0, 10)}
                style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
          </div>


          <div style={{ marginBottom: '1rem' }}>
            <label>Descrição:</label><br />
            <ReactQuill
              theme="snow"
              value={descricao}
              onChange={setDescricao}
              style={{ marginTop: '1rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={salvando}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {salvando ? 'Salvando...' : 'Salvar Sessão'}
          </button>
        </form>
      </Card>
    </div>
  );
}
