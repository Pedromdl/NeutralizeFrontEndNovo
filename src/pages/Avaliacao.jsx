import { useState } from 'react';
import UserSearch from '../components/UserSearch';
// import FormHistoricoClinico from '../components/FormHistoricoClinico';
import FormMobilidade from '../components/Avaliacao/FormMobilidade.jsx';
import FormForca from '../components/Avaliacao/FormForca.jsx';
import FormFuncao from '../components/Avaliacao/FormFuncao.jsx';
import FormEstabilidade from '../components/Avaliacao/FormEstabilidade.jsx';
import FormDor from '../components/Avaliacao/FormDor.jsx';
// import FormEscalas from '../components/FormEscalas';
import FormText from '../components/Avaliacao/FormText.jsx';
import '../components/css/Avaliacao.css';



function CadastrarDados() {

  const [resetKey, setResetKey] = useState(0);

  // Paciente
  const [pacienteSelecionado, setPacienteSelecionado] = useState(() => {
    const salvo = localStorage.getItem('avaliacao_pacienteSelecionado');
    return salvo ? JSON.parse(salvo) : null;
  });

  const handleSelecionarPaciente = (paciente) => {
  setPacienteSelecionado(paciente);
  localStorage.setItem('avaliacao_pacienteSelecionado', JSON.stringify(paciente));
  setResetKey(k => k + 1);  // incrementa para sinalizar reset
};

  // Data
  const [dataAvaliacao, setDataAvaliacao] = useState(() => {
    const salvo = localStorage.getItem('avaliacao_dataAvaliacao');
    return salvo || new Date().toISOString().slice(0, 10);
  });

  const handleDataChange = (e) => {
    const novaData = e.target.value;
    setDataAvaliacao(novaData);
    localStorage.setItem('avaliacao_dataAvaliacao', novaData);
  };

  return (
    <div className="conteudo-avaliacao">
      <div className="card-avaliacao">
        <h2>Selecionar Paciente:</h2>
        <UserSearch
          onSelect={handleSelecionarPaciente}
          valorInicial={pacienteSelecionado?.nome || ''}
        />      
        </div>

      <div className="card-avaliacao">
        <label htmlFor="dataAvaliacao" className="form-label">Data da Avaliação</label>
        <input
          id="dataAvaliacao"
          type="date"
          value={dataAvaliacao}
          onChange={handleDataChange}
          className="form-input"
        />
      </div>

      {pacienteSelecionado && (
        <>
          <FormText pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
          <FormMobilidade pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
          <FormForca pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
          <FormEstabilidade pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
          <FormFuncao pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} resetKey={resetKey} />
          <FormDor pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
        </>
      )}
    </div>
  );
}

export default CadastrarDados;
