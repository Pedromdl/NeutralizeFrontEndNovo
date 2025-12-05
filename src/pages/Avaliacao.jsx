import { useState, useEffect } from 'react';
import UserSearch from '../components/UserSearch';

import FormMobilidade from '../components/Avaliacao/FormMobilidade.jsx';
import FormForca from '../components/Avaliacao/FormForca.jsx';
import FormFuncao from '../components/Avaliacao/FormFuncao.jsx';
import FormEstabilidade from '../components/Avaliacao/FormEstabilidade.jsx';
import FormDor from '../components/Avaliacao/FormDor.jsx';
import FormText from '../components/Avaliacao/FormText.jsx';

import '../components/css/Avaliacao.css';


// ------------------- COMPONENTE DE ACCORDION -------------------
function SecaoAvaliacao({ titulo, aberto, onToggle, children }) {
  return (
    <div className="card-avaliacao">
      <div
        className="card-header"
        style={{ cursor: "pointer", fontWeight: "bold" }}
        onClick={onToggle}
      >
        {titulo} {aberto ? "▲" : "▼"}
      </div>

      {aberto && (
        <div className="card-body">
          {children}
        </div>
      )}
    </div>
  );
}


// ------------------- COMPONENTE PRINCIPAL -------------------
function CadastrarDados() {

  const [resetKey, setResetKey] = useState(0);

  // Paciente (salva apenas ID no localStorage por segurança/LGPD)
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [pacienteId, setPacienteId] = useState(() => {
    const salvoId = localStorage.getItem('avaliacao_pacienteSelecionadoId');
    return salvoId ? JSON.parse(salvoId) : null;
  });

  // Carregar dados do paciente ao iniciar (apenas ID foi salvo)
  useEffect(() => {
    if (pacienteId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${pacienteId}/`)
        .then(res => res.json())
        .then(data => setPacienteSelecionado(data))
        .catch(err => console.error('Erro ao carregar paciente:', err));
    }
  }, [pacienteId]);

  const handleSelecionarPaciente = (paciente) => {
    // Salvar apenas o ID no localStorage (segurança/LGPD)
    setPacienteId(paciente.id);
    localStorage.setItem('avaliacao_pacienteSelecionadoId', JSON.stringify(paciente.id));
    // O objeto completo será carregado via fetch (vide useEffect acima)
    setPacienteSelecionado(paciente);  // Já temos os dados do UserSearch
    setResetKey(k => k + 1);
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


  // ------------------- CONTROLE DOS CHECKBOXES -------------------
  const [visiveis, setVisiveis] = useState({
    anamnese: true,
    mobilidade: false,
    forca: false,
    estabilidade: false,
    funcao: false,
    dor: false,
  });


  // ------------------- CONTROLE DOS ACCORDIONS -------------------
  const [abertos, setAbertos] = useState({
    anamnese: false,
    mobilidade: false,
    forca: false,
    estabilidade: false,
    funcao: false,
    dor: false,
  });

  const toggleAccordion = (key) => {
    setAbertos(prev => ({ ...prev, [key]: !prev[key] }));
  };


  return (
    <div className="conteudo">

      {/* Seleção de Paciente */}
      <div className="card-avaliacao">
        <h2>Selecionar Paciente:</h2>
        <UserSearch
          onSelect={handleSelecionarPaciente}
          valorInicial={pacienteSelecionado?.nome || ''}
        />
      </div>

      {/* Data */}
      <div className="card-avaliacao">
        <p style={{ fontSize: '1.17rem', fontWeight: 'bold', marginBottom: '0.83rem' }}>
          Data da Avaliação:
        </p>

        <input
          id="dataAvaliacao"
          type="date"
          value={dataAvaliacao}
          onChange={handleDataChange}
          className="form-input"
        />
      </div>


      {/* SELEÇÃO DOS MÓDULOS */}
      <div className="card-avaliacao">
        <h3>O que deseja avaliar?</h3>

       <div className="checkbox-row">
  {Object.keys(visiveis).map(key => (
    <label key={key} className="checkbox-item">
      <input
        type="checkbox"
        checked={visiveis[key]}
        onChange={() =>
          setVisiveis(v => ({ ...v, [key]: !v[key] }))
        }
      />
      {key.toUpperCase()}
    </label>
  ))}
</div>
</div>


      {/* RENDERIZAÇÃO DOS FORMULÁRIOS */}
      {pacienteSelecionado && (
        <>

          {visiveis.anamnese && (
            <SecaoAvaliacao
              titulo="Anamnese"
              aberto={abertos.anamnese}
              onToggle={() => toggleAccordion("anamnese")}
            >
              <FormText pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
            </SecaoAvaliacao>
          )}


          {visiveis.mobilidade && (
            <SecaoAvaliacao
              titulo="Mobilidade"
              aberto={abertos.mobilidade}
              onToggle={() => toggleAccordion("mobilidade")}
            >
              <FormMobilidade pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
            </SecaoAvaliacao>
          )}


          {visiveis.forca && (
            <SecaoAvaliacao
              titulo="Força"
              aberto={abertos.forca}
              onToggle={() => toggleAccordion("forca")}
            >
              <FormForca pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
            </SecaoAvaliacao>
          )}


          {visiveis.estabilidade && (
            <SecaoAvaliacao
              titulo="Estabilidade"
              aberto={abertos.estabilidade}
              onToggle={() => toggleAccordion("estabilidade")}
            >
              <FormEstabilidade pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
            </SecaoAvaliacao>
          )}


          {visiveis.funcao && (
            <SecaoAvaliacao
              titulo="Função"
              aberto={abertos.funcao}
              onToggle={() => toggleAccordion("funcao")}
            >
              <FormFuncao
                pacienteId={pacienteSelecionado.id}
                dataAvaliacao={dataAvaliacao}
                resetKey={resetKey}
              />
            </SecaoAvaliacao>
          )}


          {visiveis.dor && (
            <SecaoAvaliacao
              titulo="Dor"
              aberto={abertos.dor}
              onToggle={() => toggleAccordion("dor")}
            >
              <FormDor pacienteId={pacienteSelecionado.id} dataAvaliacao={dataAvaliacao} />
            </SecaoAvaliacao>
          )}

        </>
      )}

    </div>
  );
}

export default CadastrarDados;
