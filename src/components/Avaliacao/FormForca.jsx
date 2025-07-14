import { useState } from 'react';
import axios from 'axios';
import '../css/FormMobilidade.css';

function FormForca({ pacienteId, dataAvaliacao }) {
  const [formularios, setFormularios] = useState([
    { musculatura: '', lado_esquerdo: '', lado_direito: '', observacao: '' }
  ]);

  const handleChange = (index, e) => {
    const novos = [...formularios];
    novos[index][e.target.name] = e.target.value;
    setFormularios(novos);
  };

  const adicionarFormulario = () => {
    setFormularios([
      ...formularios,
      { musculatura: '', lado_esquerdo: '', lado_direito: '', observacao: '' }
    ]);
  };

  const removerFormulario = (index) => {
    const novos = [...formularios];
    novos.splice(index, 1);
    setFormularios(novos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = formularios.map(f => ({
        ...f,
        paciente: pacienteId,
        data_avaliacao: dataAvaliacao,
      }));

      console.log('Enviando dados de força:', dados);

      await Promise.all(dados.map(d =>
        axios.post(`${import.meta.env.VITE_API_URL}/api/forca/`, d)
      ));

      alert('Todos os dados de força foram salvos com sucesso!');
      setFormularios([
        { musculatura: '', lado_esquerdo: '', lado_direito: '', observacao: '' }
      ]);
    } catch (err) {
      alert('Erro ao salvar dados de força');
      console.error(err);
    }
  };

  return (
    <div className="card-avaliacao">
      <h3>Registrar Força Muscular</h3>
      <form onSubmit={handleSubmit} className="form-mobilidade-grid">
        {formularios.map((form, index) => (
          <div key={index} className="form-mobilidade-container">
            <label className="form-label">Nome do Músculo</label>
            <input
              name="musculatura"
              placeholder="Ex: Quadríceps"
              value={form.musculatura}
              onChange={(e) => handleChange(index, e)}
              className="form-input"
              required
            />

            <div className="form-lados">
              <div>
                <label className="form-label">Esquerdo (kg)</label>
                <input
                  name="lado_esquerdo"
                  value={form.lado_esquerdo}
                  onChange={(e) => handleChange(index, e)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Direito (kg)</label>
                <input
                  name="lado_direito"
                  value={form.lado_direito}
                  onChange={(e) => handleChange(index, e)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <label className="form-label">Observações</label>
            <textarea
              name="observacao"
              placeholder="Ex: Compensações, dor, dificuldade..."
              value={form.observacao}
              onChange={(e) => handleChange(index, e)}
              className="form-textarea"
            />

            {formularios.length > 1 && (
              <button type="button" onClick={() => removerFormulario(index)} className="btn-remover">
                Remover
              </button>
            )}
          </div>
        ))}

        <div style={{ width: '100%', display: 'flex', justifyContent: 'right', marginTop: '1rem' }}>
          <button type="button" onClick={adicionarFormulario} className="btn-adicionar" style={{ marginRight: '1rem' }}>
            + Adicionar Força
          </button>
          <button type="submit" className="btn-salvar">Salvar Todos</button>
        </div>
      </form>
    </div>
  );
}

export default FormForca;
