import { useState } from 'react';
import UserSearch from '../components/UserSearch';
// import FormHistoricoClinico from '../components/FormHistoricoClinico';
import FormMobilidade from '../components/Avaliacao/FormMobilidade.jsx';
import FormForca from '../components/Avaliacao/FormForca.jsx';
import FormFuncao from '../components/Avaliacao/FormFuncao.jsx';
import FormDor from '../components/Avaliacao/FormDor.jsx';
// import FormEscalas from '../components/FormEscalas';
import '../components/css/Avaliacao.css';
import FormText from '../components/Avaliacao/FormText.jsx';


function CadastrarDados() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [dataAvaliacao, setDataAvaliacao] = useState(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    return hoje;
  });


  return (
    <div className="conteudo">
      <div className="card-avaliacao">
        <h2>Selecionar Paciente:</h2>
        <UserSearch onSelect={setPacienteSelecionado} />
      </div>
      
      <div className="data-avaliacao-card">
        <label htmlFor="dataAvaliacao" className="form-label">Data da Avaliação</label>
        <input
          id="dataAvaliacao"
          type="date"
          value={dataAvaliacao}
          onChange={(e) => setDataAvaliacao(e.target.value)}
          className="form-input"
        />
      </div>

      {pacienteSelecionado && (
        <>
          <FormText pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
          <FormMobilidade pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
          <FormForca pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
          <FormFuncao pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
          <FormDor pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
        </>
      )}
    </div>
  );
}

export default CadastrarDados;
