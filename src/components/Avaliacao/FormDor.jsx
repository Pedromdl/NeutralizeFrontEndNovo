import { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/FormMobilidade.css';

function FormDor({ pacienteId, dataAvaliacao }) {
  const localStorageKey = `formDor-${pacienteId}`;

  const [formularios, setFormularios] = useState(() => {
    const salvo = localStorage.getItem(localStorageKey);
    return salvo
      ? JSON.parse(salvo)
      : [{ teste: '', resultado: '', observacao: '' }];
  });

  const [testesDisponiveis, setTestesDisponiveis] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/testes/?categoria=Testes de Dor`)
      .then(response => setTestesDisponiveis(response.data))
      .catch(err => console.error('Erro ao buscar testes:', err));
  }, []);

  // Salva no localStorage a cada alteração do formulário
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
      { teste: '', resultado: '', observacao: '' }
    ]);
  };

  const removerFormulario = (index) => {
    const novos = [...formularios];
    novos.splice(index, 1);
    setFormularios(novos);
  };

  // Função para resetar formulário e localStorage
  const resetarFormulario = () => {
    setFormularios([{ teste: '', resultado: '', observacao: '' }]);
    localStorage.removeItem(localStorageKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = formularios.map(f => ({
        teste: f.teste,
        resultado: f.resultado,
        observacao: f.observacao,
        paciente: pacienteId,
        data_avaliacao: dataAvaliacao,
      }));

      console.log('Enviando dados:', dados);

      await Promise.all(dados.map(d =>
        axios.post(`${import.meta.env.VITE_API_URL}/api/testedor/`, d)
      ));

      alert('Todos os testes de dor foram salvos com sucesso!');
      resetarFormulario();
    } catch (err) {
      alert('Erro ao salvar testes de dor');
      console.error(err);
    }
  };

  return (
    <div className="">
      <h3>Registrar Testes de Dor</h3>
      <form onSubmit={handleSubmit} className="form-mobilidade-grid">
        {formularios.map((form, index) => (
          <div key={index} className="form-mobilidade-container">
            <label className="form-label">Nome do Teste</label>
            <select
              name="teste"
              value={form.teste}
              onChange={(e) => handleChange(index, e)}
              className="form-input"
              required
            >
              <option value="">Selecione o teste</option>
              {testesDisponiveis.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>

            <div className="form-lados">
              <div>
                <label className="form-label">Resultado</label>
                <input
                  name="resultado"
                  value={form.resultado}
                  onChange={(e) => handleChange(index, e)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <label className="form-label">Observações</label>
            <textarea
              name="observacao"
              placeholder="Ex: Dor em repouso e/ou movimento"
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

export default FormDor;
