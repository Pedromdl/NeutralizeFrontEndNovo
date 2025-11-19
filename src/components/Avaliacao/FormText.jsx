import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/FormMobilidade.css';

function FormText({ pacienteId, dataAvaliacao }) {
  const [formularios, setFormularios] = useState([{ titulo: '', descricao: '' }]);
  const [textosPreDefinidos, setTextosPreDefinidos] = useState([]);
  const storageKey = `anamnese_${pacienteId}_${dataAvaliacao}`;

  // Buscar textos pré-definidos do backend ao montar componente
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/preavaliacao/`)
      .then(response => setTextosPreDefinidos(response.data))
      .catch(err => {
        console.error('Erro ao buscar textos pré-definidos:', err);
        setTextosPreDefinidos([]);
      });

    // Carregar do localStorage
    const salvo = localStorage.getItem(storageKey);
    if (salvo) {
      setFormularios([{ titulo: '', descricao: salvo }]);
    }
  }, [storageKey]);

  // Salva no localStorage a cada alteração da descrição
  useEffect(() => {
    localStorage.setItem(storageKey, formularios[0].descricao || '');
  }, [formularios, storageKey]);

  const handleDescricaoChange = (index, valor) => {
    const novos = [...formularios];
    novos[index].descricao = valor;
    setFormularios(novos);
  };

  const handleAddTextoPreDefinido = (index, texto) => {
    const novos = [...formularios];
    const conteudoAtual = novos[index].descricao || '';
    // Adiciona texto ao conteúdo atual, mantendo uma quebra de linha
    novos[index].descricao = conteudoAtual + (conteudoAtual ? '\n\n' : '') + texto;
    setFormularios(novos);
  };

  // Função para resetar formulário e localStorage
  const resetarFormulario = () => {
    setFormularios([{ titulo: '', descricao: '' }]);
    localStorage.removeItem(storageKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dado = {
        paciente: pacienteId,
        conteudo_html: formularios[0].descricao,
        data_avaliacao: dataAvaliacao,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/anamnese/`, dado);
      localStorage.removeItem(storageKey);

      alert('Anamnese salva com sucesso!');
      resetarFormulario();
    } catch (err) {
      alert('Erro ao salvar anamnese');
      console.error(err);
    }
  };

  return (
    <div className="card-avaliacao">
      <h3>Registrar Anamnese</h3>
      <form onSubmit={handleSubmit} className="form-anamnese-grid">
        {formularios.map((form, index) => (
          <div key={index} className="form-anamnese-container" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ marginTop: '1rem' }}>
              Selecionar avaliação pré-definida para adicionar:
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const textoSelecionado = textosPreDefinidos.find(t => t.id === Number(e.target.value));
                  if (textoSelecionado) handleAddTextoPreDefinido(index, textoSelecionado.texto);
                  e.target.value = ''; // resetar select
                }
              }}
              className="form-input"
            >
              <option value="">-- Escolha um texto --</option>
              {textosPreDefinidos.map(t => (
                <option key={t.id} value={t.id}>{t.titulo || t.label || t.nome}</option>
              ))}
            </select>

            <label className="form-label" style={{ marginTop: '1rem' }}>Descrição</label>
            <ReactQuill
              theme="snow"
              value={form.descricao}
              onChange={(valor) => handleDescricaoChange(index, valor)}
              style={{ height: '800px', marginBottom: '1rem' }}
            />
          </div>
        ))}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'right', marginTop: '5rem' }}>
          <button
            type="button"
            onClick={resetarFormulario}
            className="btn-resetar"
            style={{ marginRight: '1rem', backgroundColor: '#f44336', color: 'white' }}
          >
            Resetar
          </button>
          <button type="submit" className="btn-salvar">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormText;
