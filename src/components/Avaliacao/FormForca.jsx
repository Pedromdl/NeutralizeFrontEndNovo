import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/FormMobilidade.css';

function FormForca({ pacienteId, dataAvaliacao }) {
  const localStorageKey = `forcaForm-${pacienteId}`;

  const [formularios, setFormularios] = useState(() => {
    const salvo = localStorage.getItem(localStorageKey);
    return salvo
      ? JSON.parse(salvo)
      : [{ movimento_forca: '', lado_esquerdo: '', lado_direito: '', observacao: '' }];
  });

  // Estado filtroBusca por formulário (array)
  const [filtrosBusca, setFiltrosBusca] = useState(() =>
    formularios.map(() => '')
  );

  const [opcoesNomes, setOpcoesNomes] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/testes/`)
      .then(res => {
        const idCategoriaTestesDeMovimento = 8;
        const somenteTestesDeMovimento = res.data.filter(
          teste => teste.categoria === idCategoriaTestesDeMovimento
        );
        setOpcoesNomes(somenteTestesDeMovimento);
      })
      .catch(err => console.error('Erro ao carregar opções de testes:', err));
  }, []);

  // Sincronizar filtrosBusca com formularios quando mudar quantidade
  useEffect(() => {
    if (filtrosBusca.length !== formularios.length) {
      setFiltrosBusca(formularios.map((_, i) => filtrosBusca[i] || ''));
    }
  }, [formularios, filtrosBusca]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(formularios));
  }, [formularios, localStorageKey]);

  const handleChange = (index, e) => {
    const novos = [...formularios];
    novos[index][e.target.name] = e.target.value;
    setFormularios(novos);
  };

  // Atualiza filtroBusca individual
  const handleFiltroBuscaChange = (index, valor) => {
    const novosFiltros = [...filtrosBusca];
    novosFiltros[index] = valor;
    setFiltrosBusca(novosFiltros);

    // Se estiver digitando, limpa a seleção do movimento_forca
    if (valor !== '') {
      const novosForm = [...formularios];
      novosForm[index].movimento_forca = '';
      setFormularios(novosForm);
    }
  };

  // Seleciona uma opção no autocomplete
  const selecionarOpcao = (index, opcao) => {
    const novosForm = [...formularios];
    novosForm[index].movimento_forca = opcao.id;
    setFormularios(novosForm);

    const novosFiltros = [...filtrosBusca];
    novosFiltros[index] = opcao.nome;
    setFiltrosBusca(novosFiltros);
  };

  const adicionarFormulario = () => {
    setFormularios([
      ...formularios,
      { movimento_forca: '', lado_esquerdo: '', lado_direito: '', observacao: '' }
    ]);
    setFiltrosBusca([...filtrosBusca, '']);
  };

  const removerFormulario = (index) => {
    const novos = [...formularios];
    novos.splice(index, 1);
    setFormularios(novos);

    const novosFiltros = [...filtrosBusca];
    novosFiltros.splice(index, 1);
    setFiltrosBusca(novosFiltros);
  };

  const resetarFormulario = () => {
    setFormularios([{ movimento_forca: '', lado_esquerdo: '', lado_direito: '', observacao: '' }]);
    setFiltrosBusca(['']);
    localStorage.removeItem(localStorageKey);
  };

  return (
    <div className="card-avaliacao">
      <h3>Registrar Força Muscular</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const dados = formularios.map(f => ({
              paciente: pacienteId,
              data_avaliacao: dataAvaliacao,
              movimento_forca: f.movimento_forca,
              lado_esquerdo: f.lado_esquerdo,
              lado_direito: f.lado_direito,
              observacao: f.observacao,
            }));

            console.log('Enviando dados de força:', dados);

            await Promise.all(dados.map(d =>
              axios.post(`${import.meta.env.VITE_API_URL}/api/forca/`, d)
            ));

            alert('Todos os dados de força foram salvos com sucesso!');
            resetarFormulario();
          } catch (err) {
            alert('Erro ao salvar dados de força');
            console.error(err);
          }
        }}
        className="form-mobilidade-grid"
      >
        {formularios.map((form, index) => (
          <div key={index} className="form-mobilidade-container">
            <label className="form-label">Nome do Movimento</label>
            <div className="autocomplete-container">
              <input
  type="text"
  placeholder="Buscar por nome ou região (ex: ombro)"
  value={
    filtrosBusca[index] !== ''
      ? filtrosBusca[index] // texto digitado, mostra filtroBusca para abrir dropdown
      : (opcoesNomes.find(t => t.id === form.movimento_forca)?.nome || '') // mostra nome do selecionado quando não está digitando
  }
  onChange={(e) => handleFiltroBuscaChange(index, e.target.value)}
  className="form-input"
  autoComplete="off"
  required
/>
{filtrosBusca[index] !== '' && (
  <ul className="autocomplete-list">
    {opcoesNomes
      .filter(opcao => opcao.nome.toLowerCase().includes(filtrosBusca[index].toLowerCase()))
      .slice(0, 5)
      .map(opcao => (
        <li
          key={opcao.id}
          onClick={() => {
            selecionarOpcao(index, opcao);
            // limpa filtroBusca para fechar dropdown
            const novosFiltros = [...filtrosBusca];
            novosFiltros[index] = '';
            setFiltrosBusca(novosFiltros);
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
              <button
                type="button"
                onClick={() => removerFormulario(index)}
                className="btn-remover"
              >
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
            + Adicionar Força
          </button>
          <button type="submit" className="btn-salvar">
            Salvar Todos
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormForca;
