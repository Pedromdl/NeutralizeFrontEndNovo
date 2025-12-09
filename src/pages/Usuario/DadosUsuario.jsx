// DadosUsuario.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from '../../components/Card';
import { useCep } from '../../useCep';
import '../../components/css/DadosUsuario.css';

export default function DadosUsuario({ usuarioSelecionado, atualizarUsuario, token, mostrarEndereco = true }) {
  const [editando, setEditando] = useState(false);
  const [dados, setDados] = useState({});
  const cepInputRef = useRef(null);
  
  // Usar o hook de CEP
  const { 
    buscarEnderecoPorCep, 
    formatarCep, 
    aplicarMascaraCep, 
    buscandoCep, 
    erroCep, 
    limparErro 
  } = useCep();

  // Carregar dados (público ou privado)
  useEffect(() => {
    async function fetchUsuarioPublico() {
      if (!token) {
        setDados({ ...usuarioSelecionado });
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuario-publico/${token}/`);
        setDados(res.data);
      } catch (error) {
        console.error('Erro ao carregar usuário público:', error);
      }
    }
    fetchUsuarioPublico();
  }, [usuarioSelecionado, token]);

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 'Não informada';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  };

  // Manipulador específico para CEP
  const handleCepChange = (e) => {
    const valor = e.target.value;
    const cepComMascara = aplicarMascaraCep(valor);
    const cepNumerico = valor.replace(/\D/g, '');
    
    // Atualiza o campo com máscara
    if (cepInputRef.current) {
      cepInputRef.current.value = cepComMascara;
    }
    
    // Atualiza o estado com apenas números
    setDados(prev => ({ ...prev, cep: cepNumerico }));
    
    // Limpa erro ao digitar
    if (erroCep) {
      limparErro();
    }
  };

  // Buscar CEP quando o campo perde o foco
  const handleCepBlur = async () => {
    const cepNumerico = dados.cep || '';
    
    if (cepNumerico.length === 8) {
      const endereco = await buscarEnderecoPorCep(cepNumerico);
      if (endereco) {
        setDados(prev => ({
          ...prev,
          ...endereco
        }));
      }
    }
  };

  // Manipulador genérico para outros campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Se for o campo estado, converte para maiúsculas
    if (name === 'estado') {
      setDados(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setDados(prev => ({ ...prev, [name]: value }));
    }
  };

  const salvar = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${dados.id}/`, dados);
      atualizarUsuario(response.data);
      setEditando(false);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const cancelar = () => {
    setDados({ ...usuarioSelecionado });
    setEditando(false);
    limparErro();
  };

  return (
    <Card title="Dados do Usuário" size="al">
      <div className="usuario-secoes">

        {/* ==============================
            SEÇÃO: DADOS PESSOAIS
        =============================== */}
        <div className="secao-card">
          <h3>Informações Pessoais</h3>

          {/* Nome */}
          <div className="linha-dado">
            <label>Nome</label>
            {editando && !token ? (
              <input name="nome" value={dados.nome || ''} onChange={handleChange} />
            ) : (
              <span>{dados.nome || "Não informado"}</span>
            )}
          </div>

          {/* Email */}
          <div className="linha-dado">
            <label>Email</label>
            {editando && !token ? (
              <input 
                name="email" 
                type="email"
                value={dados.email || ''} 
                onChange={handleChange} 
              />
            ) : (
              <span>{dados.email || "Não informado"}</span>
            )}
          </div>

          {/* Telefone */}
          <div className="linha-dado">
            <label>Telefone</label>
            {editando && !token ? (
              <input 
                name="telefone" 
                value={dados.telefone || ''} 
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            ) : (
              <span>{dados.telefone || "Não informado"}</span>
            )}
          </div>

          {/* Data de nascimento */}
          <div className="linha-dado">
            <label>Data de Nascimento</label>
            {editando && !token ? (
              <input
                type="date"
                name="data_de_nascimento"
                value={dados.data_de_nascimento || ''}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            ) : (
              <span>{dados.data_de_nascimento ? new Date(dados.data_de_nascimento).toLocaleDateString('pt-BR') : "Não informada"}</span>
            )}
          </div>

          {/* Idade */}
          <div className="linha-dado">
            <label>Idade</label>
            {editando && !token ? (
              <input disabled value={calcularIdade(dados.data_de_nascimento)} />
            ) : (
              <span>{calcularIdade(dados.data_de_nascimento)}</span>
            )}
          </div>
        </div>

        {/* ==============================
            SEÇÃO: ENDEREÇO (condicional)
        =============================== */}
        {mostrarEndereco && (
          <div className="secao-card">
            <h3>Endereço</h3>

            {/* CEP com busca automática */}
            <div className="linha-dado">
              <label>CEP</label>
              {editando && !token ? (
                <div className="cep-input-container">
                  <input
                    ref={cepInputRef}
                    name="cep"
                    defaultValue={formatarCep(dados.cep)}
                    onChange={handleCepChange}
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                    maxLength={9}
                    disabled={buscandoCep}
                    className={erroCep ? 'input-erro' : ''}
                  />
                  {buscandoCep && (
                    <span className="carregando-cep">
                      <span className="spinner-cep"></span> Buscando...
                    </span>
                  )}
                  {erroCep && !buscandoCep && (
                    <span className="erro-cep">{erroCep}</span>
                  )}
                </div>
              ) : (
                <span>{formatarCep(dados.cep) || "Não informado"}</span>
              )}
            </div>

            {/* Rua */}
            <div className="linha-dado">
              <label>Rua</label>
              {editando && !token ? (
                <input 
                  name="rua" 
                  value={dados.rua || ''} 
                  onChange={handleChange} 
                  disabled={buscandoCep}
                />
              ) : (
                <span>{dados.rua || "Não informado"}</span>
              )}
            </div>

            {/* Número */}
            <div className="linha-dado">
              <label>Número</label>
              {editando && !token ? (
                <input 
                  name="numero" 
                  value={dados.numero || ''} 
                  onChange={handleChange}
                  disabled={buscandoCep}
                />
              ) : (
                <span>{dados.numero || "Não informado"}</span>
              )}
            </div>

            {/* Bairro */}
            <div className="linha-dado">
              <label>Bairro</label>
              {editando && !token ? (
                <input 
                  name="bairro" 
                  value={dados.bairro || ''} 
                  onChange={handleChange} 
                  disabled={buscandoCep}
                />
              ) : (
                <span>{dados.bairro || "Não informado"}</span>
              )}
            </div>

            {/* Cidade */}
            <div className="linha-dado">
              <label>Cidade</label>
              {editando && !token ? (
                <input 
                  name="cidade" 
                  value={dados.cidade || ''} 
                  onChange={handleChange} 
                  disabled={buscandoCep}
                />
              ) : (
                <span>{dados.cidade || "Não informado"}</span>
              )}
            </div>

            {/* Estado */}
            <div className="linha-dado">
              <label>Estado</label>
              {editando && !token ? (
                <input 
                  name="estado" 
                  value={dados.estado || ''} 
                  onChange={handleChange} 
                  disabled={buscandoCep}
                  maxLength={2}
                  style={{ width: '60px', textTransform: 'uppercase' }}
                />
              ) : (
                <span>{dados.estado || "Não informado"}</span>
              )}
            </div>

            {/* Complemento */}
            <div className="linha-dado">
              <label>Complemento</label>
              {editando && !token ? (
                <input 
                  name="complemento" 
                  value={dados.complemento || ''} 
                  onChange={handleChange} 
                  disabled={buscandoCep}
                  placeholder="Apto, bloco, etc."
                />
              ) : (
                <span>{dados.complemento || "Não informado"}</span>
              )}
            </div>
          </div>
        )}

        {/* Botões de edição */}
        {!token && editando && (
          <div className="botoes-edicao">
            <button onClick={salvar} disabled={buscandoCep}>
              {buscandoCep ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={cancelar} disabled={buscandoCep}>Cancelar</button>
          </div>
        )}

        {!token && !editando && (
          <div className="botoes-edicao">
            <button className="black" onClick={() => setEditando(true)}>Editar</button>
          </div>
        )}

      </div>
    </Card>
  );
}