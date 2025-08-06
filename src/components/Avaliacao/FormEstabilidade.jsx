import { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/FormMobilidade.css';

function FormEstabilidade({ pacienteId, dataAvaliacao }) {
  const localStorageKey = `formEstabilidade-${pacienteId}`;

  const [formularios, setFormularios] = useState(() => {
    const salvo = localStorage.getItem(localStorageKey);
    return salvo
      ? JSON.parse(salvo)
      : [{ movimento_estabilidade: '', lado_esquerdo: '', lado_direito: '', observacao: '' }];
  });

  const [opcoesMovimentos, setOpcoesMovimentos] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/testes/?categoria=Testes de Estabilidade`)
      .then(response => setOpcoesMovimentos(response.data))
      .catch(err => console.error('Erro ao buscar testes de estabilidade:', err));
  }, []);

  // Atualiza localStorage a cada falteração do formulário
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(formularios));
  }, [formularios, localStorageKey]);

  const handleChange = (index, e) => {
    const novos = [...formularios];
    novos[index][e.target.name] = e.target.value;
    setFormularios(novos);
  };

  const adicionarFormulario = () => {
    setFormularios([
      ...formularios,
      { movimento_estabilidade: '', lado_esquerdo: '', lado_direito: '', observacao: '' }
    ]);
  };

  const removerFormulario = (index) => {
    const novos = [...formularios];
    novos.splice(index, 1);
    setFormularios(novos);
  };

  // Função para resetar formulário e localStorage
  const resetarFormulario = () => {
    setFormularios([{ movimento_estabilidade: '', lado_esquerdo: '', lado_direito: '', observacao: '' }]);
    localStorage.removeItem(localStorageKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = formularios.map(f => ({
        movimento_estabilidade: f.movimento_estabilidade,
        lado_esquerdo: f.lado_esquerdo,
        lado_direito: f.lado_direito,
        observacao: f.observacao,
        paciente: pacienteId,
        data_avaliacao: dataAvaliacao,
      }));

      console.log('Enviando dados:', dados);

      await Promise.all(dados.map(d =>
        axios.post(`${import.meta.env.VITE_API_URL}/api/testeestabilidade/`, d)
      ));

      alert('Todos os testes de estabilidade foram salvos com sucesso!');
      resetarFormulario();
    } catch (err) {
      alert('Erro ao salvar testes de estabilidade');
      console.error(err);
    }
  };

  return (
    <div className="card-avaliacao">
      <h3>Registrar Testes de Estabilidade</h3>
      <form onSubmit={handleSubmit} className="form-mobilidade-grid">
        {formularios.map((form, index) => (
          <div key={index} className="form-mobilidade-container">
            <label className="form-label">Nome do Movimento</label>
            <select
              name="movimento_estabilidade"
              value={form.movimento_estabilidade}
              onChange={(e) => handleChange(index, e)}
              className="form-input"
              required
            >
              <option value="">Selecione o movimento</option>
              {opcoesMovimentos.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>

            <div className="form-lados">
              <div>
                <label className="form-label">Lado Esquerdo</label>
                <input
                  name="lado_esquerdo"
                  value={form.lado_esquerdo}
                  onChange={(e) => handleChange(index, e)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Lado Direito</label>
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
              placeholder="Ex: Dor, compensações..."
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
          <button
            type="button"
            onClick={resetarFormulario}
            className="btn-resetar"
            style={{ marginRight: '1rem', backgroundColor: '#f44336', color: 'white' }}
          >
            Resetar
          </button>
          <button
            type="button"
            onClick={adicionarFormulario}
            className="btn-adicionar"
            style={{ marginRight: '1rem' }}
          >
            + Adicionar Teste
          </button>
          <button type="submit" className="btn-salvar">
            Salvar Todos
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormEstabilidade;
