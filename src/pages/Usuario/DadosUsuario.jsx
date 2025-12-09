// DadosUsuario.jsx - VERSÃO CORRIGIDA (usando axios já configurado)
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios'; // JÁ CONFIGURADO PELO AuthProvider
import Card from '../../components/Card';
import { useCep } from '../../useCep';
import '../../components/css/DadosUsuario.css';

export default function DadosUsuario({ 
  usuarioId,
  atualizarUsuario, 
  token,
  mostrarEndereco = true 
}) {
  const [editando, setEditando] = useState(false);
  const [dados, setDados] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);
  
  const { 
    buscarEnderecoPorCep, 
    formatarCep, 
    aplicarMascaraCep, 
    buscandoCep, 
    erroCep, 
    limparErro 
  } = useCep();

  // Buscar dados completos
  const buscarDadosCompletos = useCallback(async () => {
  if (!usuarioId && !token) {
    setCarregando(false);
    return;
  }
  
  setCarregando(true);
  setErro(null);
  
  try {
    let url;
    
    if (token) {
      // URL COMPLETA para modo público
      url = `${import.meta.env.VITE_API_URL}/api/usuario-publico/${token}/`;
    } else {
      // URL COMPLETA para modo admin (igual ao BancoExercicios)
      url = `${import.meta.env.VITE_API_URL}/api/usuarios/${usuarioId}/dados_completos/`;
    }
    
    console.log('Fazendo requisição para:', url);
    
    const response = await axios.get(url);
    setDados(response.data);
    
  } catch (error) {
    // ... tratamento de erro
  } finally {
    setCarregando(false);
  }
}, [usuarioId, token]);

  useEffect(() => {
    buscarDadosCompletos();
  }, [buscarDadosCompletos]);

  // Calcular idade
  const idade = useMemo(() => {
    if (!dados.data_de_nascimento) return 'Não informada';
    const hoje = new Date();
    const nascimento = new Date(dados.data_de_nascimento);
    let idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idadeCalculada--;
    }
    return idadeCalculada;
  }, [dados.data_de_nascimento]);

  // Manipulador de CEP
  const handleCepChange = useCallback((e) => {
    const valor = e.target.value;
    const cepNumerico = valor.replace(/\D/g, '');
    const cepFormatado = aplicarMascaraCep(valor);
    
    setDados(prev => ({ 
      ...prev, 
      cep: cepNumerico,
      cep_formatado: cepFormatado
    }));
    
    if (erroCep) {
      limparErro();
    }
  }, [aplicarMascaraCep, erroCep, limparErro]);

  // Buscar endereço por CEP
  const handleCepBlur = useCallback(async () => {
    const cepNumerico = dados.cep || '';
    if (cepNumerico.length === 8) {
      const endereco = await buscarEnderecoPorCep(cepNumerico);
      if (endereco) {
        setDados(prev => ({ ...prev, ...endereco }));
      }
    }
  }, [dados.cep, buscarEnderecoPorCep]);

  // Manipulador genérico
  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    
    if (type === 'date') {
      setDados(prev => ({ ...prev, [name]: value }));
    } else if (name === 'estado') {
      setDados(prev => ({ ...prev, [name]: value.toUpperCase().slice(0, 2) }));
    } else {
      setDados(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  // Salvar alterações
  const salvar = useCallback(async () => {
    if (salvando || buscandoCep) return;
    
    setSalvando(true);
    setErro(null);
    
    try {
      const dadosParaEnviar = { ...dados };
      delete dadosParaEnviar.cep_formatado;
      
      // Usa axios diretamente (já configurado com autenticação)
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/usuarios/${dados.id}/`, // URL COMPLETA aqui também
        dadosParaEnviar
      );
      
      setDados(response.data);
      if (atualizarUsuario) atualizarUsuario(response.data);
      setEditando(false);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      
      let mensagemErro = 'Erro ao salvar os dados';
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          const erros = Object.values(error.response.data).flat();
          mensagemErro = erros.join(', ') || mensagemErro;
        } else {
          mensagemErro = error.response.data;
        }
      }
      
      setErro(mensagemErro);
    } finally {
      setSalvando(false);
    }
  }, [dados, atualizarUsuario, salvando, buscandoCep]);

  // Cancelar edição
  const cancelar = useCallback(() => {
    buscarDadosCompletos();
    setEditando(false);
    setErro(null);
    limparErro();
  }, [buscarDadosCompletos, limparErro]);

  // Estados
  const modoVisualizacao = !!token;
  const podeEditar = !modoVisualizacao && !carregando;

  // Renderização
  if (carregando) return (
    <Card title="Dados do Usuário" size="al">
      <div className="carregando">Carregando...</div>
    </Card>
  );

  if (erro && !dados.id) return (
    <Card title="Dados do Usuário" size="al">
      <div className="erro-container">
        <div className="erro-mensagem">⚠️ {erro}</div>
        {!modoVisualizacao && (
          <button onClick={buscarDadosCompletos}>Tentar novamente</button>
        )}
      </div>
    </Card>
  );

  if (!dados.id) return (
    <Card title="Dados do Usuário" size="al">
      <div className="sem-dados">Nenhum usuário selecionado</div>
    </Card>
  );

  return (
    <Card title="Dados do Usuário" size="al">
      {erro && <div className="mensagem-erro">⚠️ {erro}</div>}
      {salvando && <div className="mensagem-salvando">Salvando...</div>}

      <div className="usuario-secoes">
        {/* Seção Dados Pessoais */}
        <div className="secao-card">
          <h3>Informações Pessoais</h3>
          
          {/* Nome, Email, Telefone, Data Nasc, Idade */}
          {['nome', 'email', 'telefone'].map((campo) => (
            <div key={campo} className="linha-dado">
              <label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
              {editando && podeEditar ? (
                <input 
                  name={campo}
                  type={campo === 'email' ? 'email' : 'text'}
                  value={dados[campo] || ''}
                  onChange={handleChange}
                  disabled={salvando}
                  placeholder={campo === 'telefone' ? '(11) 99999-9999' : ''}
                />
              ) : (
                <span>{dados[campo] || "Não informado"}</span>
              )}
            </div>
          ))}
          
          <div className="linha-dado">
            <label>Data de Nascimento</label>
            {editando && podeEditar ? (
              <input
                type="date"
                name="data_de_nascimento"
                value={dados.data_de_nascimento ? dados.data_de_nascimento.split('T')[0] : ''}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                disabled={salvando}
              />
            ) : (
              <span>
                {dados.data_de_nascimento 
                  ? new Date(dados.data_de_nascimento).toLocaleDateString('pt-BR') 
                  : "Não informada"}
              </span>
            )}
          </div>
          
          <div className="linha-dado">
            <label>Idade</label>
            <span>{idade}</span>
          </div>
        </div>

        {/* Seção Endereço */}
        {mostrarEndereco && (
          <div className="secao-card">
            <h3>Endereço</h3>
            
            {/* CEP */}
            <div className="linha-dado">
              <label>CEP</label>
              {editando && podeEditar ? (
                <div className="cep-input-container">
                  <input
                    name="cep"
                    value={dados.cep_formatado || formatarCep(dados.cep) || ''}
                    onChange={handleCepChange}
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                    maxLength={9}
                    disabled={salvando || buscandoCep}
                    className={erroCep ? 'input-erro' : ''}
                  />
                  {buscandoCep && <span>Buscando...</span>}
                  {erroCep && <span className="erro-cep">{erroCep}</span>}
                </div>
              ) : (
                <span>{formatarCep(dados.cep) || "Não informado"}</span>
              )}
            </div>

            {/* Outros campos de endereço */}
            {['rua', 'numero', 'bairro', 'cidade', 'estado', 'complemento'].map((campo) => (
              <div key={campo} className="linha-dado">
                <label>
                  {campo === 'rua' ? 'Rua' :
                   campo === 'numero' ? 'Número' :
                   campo === 'bairro' ? 'Bairro' :
                   campo === 'cidade' ? 'Cidade' :
                   campo === 'estado' ? 'Estado' : 'Complemento'}
                </label>
                {editando && podeEditar ? (
                  <input
                    name={campo}
                    value={dados[campo] || ''}
                    onChange={handleChange}
                    disabled={salvando || buscandoCep}
                    maxLength={campo === 'estado' ? 2 : undefined}
                    style={campo === 'estado' ? { width: '60px', textTransform: 'uppercase' } : {}}
                  />
                ) : (
                  <span>{dados[campo] || "Não informado"}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Botões */}
        {podeEditar && (
          <div className="botoes-edicao">
            {editando ? (
              <>
                <button onClick={salvar} disabled={salvando || buscandoCep}>
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
                <button onClick={cancelar} disabled={salvando || buscandoCep}>
                  Cancelar
                </button>
              </>
            ) : (
              <button onClick={() => setEditando(true)}>
                Editar Dados
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}