import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/FormMobilidade.css';

function FormMobilidade({ pacienteId, dataAvaliacao }) {
  const localStorageKey = `mobilidadeForm-${pacienteId}`;

  const [formularios, setFormularios] = useState(() => {
    const salvo = localStorage.getItem(localStorageKey);
    return salvo
      ? JSON.parse(salvo)
      : [{ nome: '', lado_esquerdo: '', lado_direito: '', observacao: '' }];
  });

  const [opcoesNomes, setOpcoesNomes] = useState([]);
  const [filtroBusca, setFiltroBusca] = useState('');


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/testes/`)
      .then(res => {
        const idCategoriaTestesDeMovimento = 8; // ID da categoria desejada
        const somenteTestesDeMovimento = res.data.filter(
          (teste) => teste.categoria === idCategoriaTestesDeMovimento
        );
        setOpcoesNomes(somenteTestesDeMovimento);
      })
      .catch(err => console.error('Erro ao carregar opções de testes:', err));
  }, []);


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
      { nome: '', lado_esquerdo: '', lado_direito: '', observacao: '' }
    ]);
  };

  const removerFormulario = (index) => {
    const novos = [...formularios];
    novos.splice(index, 1);
    setFormularios(novos);
  };

  // Função para resetar formulário e localStorage
  const resetarFormulario = () => {
    setFormularios([{ nome: '', lado_esquerdo: '', lado_direito: '', observacao: '' }]);
    localStorage.removeItem(localStorageKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = formularios.map(f => ({
        ...f,
        paciente: pacienteId,
        data_avaliacao: dataAvaliacao,
      }));

      console.log('Enviando dados:', dados);

      await Promise.all(dados.map(d =>
        axios.post(`${import.meta.env.VITE_API_URL}/api/mobilidade/`, d)
      ));

      alert('Todos os dados foram salvos com sucesso!');

      // Limpa o estado e o localStorage
      resetarFormulario();
    } catch (err) {
      alert('Erro ao salvar dados de mobilidade');
      console.error(err);
    }
  };

  return (
    <div className="">
      <h3>Registrar Mobilidade</h3>
      <form onSubmit={handleSubmit} className="form-mobilidade-grid">
        {formularios.map((form, index) => (
          <div key={index} className="form-mobilidade-container">
            <label className="form-label">Nome da Mobilidade</label>
            <div className="autocomplete-container">
              <input
                type="text"
                name="nome"
                placeholder="Buscar por nome ou região (ex: ombro)"
                value={
                  filtroBusca !== ''
                    ? filtroBusca
                    : opcoesNomes.find((opcao) => opcao.id === formularios[index].nome)?.nome || ''
                } onChange={(e) => {
                  handleChange(index, e);
                  setFiltroBusca(e.target.value.toLowerCase());
                }}
                className="form-input"
                autoComplete="off"
                required
              />
              {filtroBusca && (
                <ul className="autocomplete-list">
                  {opcoesNomes
                    .filter((opcao) => opcao.nome.toLowerCase().includes(filtroBusca))
                    .slice(0, 5)
                    .map((opcao) => (
                      <li
                        key={opcao.id}
                        onClick={() => {
                          const novos = [...formularios];
                          novos[index].nome = opcao.id;
                          setFormularios(novos);
                          setFiltroBusca(''); // limpa dropdown
                        }}
                      >
                        {opcao.nome}
                      </li>
                    ))}
                </ul>
              )}
            </div>


            <div className="form-lados">
              <div>
                <label className="form-label">Esquerdo (º)</label>
                <input
                  name="lado_esquerdo"
                  value={form.lado_esquerdo}
                  onChange={(e) => handleChange(index, e)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Direito (º)</label>
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
              placeholder="Descreva qualquer observação..."
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
            style={{backgroundColor: '#f44336', color: 'white' }}
          >
            Resetar
          </button>
          <button
            type="button"
            onClick={adicionarFormulario}
            className="btn-adicionar"          >
          Adicionar Mobilidade
          </button>
          <button type="submit" className="btn-salvar">
            Salvar Todos
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormMobilidade;
