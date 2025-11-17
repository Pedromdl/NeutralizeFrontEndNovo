import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';
import '../../components/css/DadosUsuario.css';

export default function DadosUsuario({ usuarioSelecionado, atualizarUsuario, token, mostrarEndereco = true }) {
  const [editando, setEditando] = useState(false);
  const [dados, setDados] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
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
              <input name="email" value={dados.email || ''} onChange={handleChange} />
            ) : (
              <span>{dados.email || "Não informado"}</span>
            )}
          </div>

{/* Telefone */}
<div className="linha-dado">
  <label>Telefone</label>
  {editando && !token ? (
    <input name="telefone" value={dados.telefone || ''} onChange={handleChange} />
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
    />
  ) : (
    <span>{dados.data_de_nascimento ? new Date(dados.data_de_nascimento).toLocaleDateString() : "Não informada"}</span>
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

            {['cep','rua','numero','bairro','cidade','estado','complemento'].map((campo) => (
              <div className="linha-dado" key={campo}>
                <label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
                {editando && !token ? (
                  <input name={campo} value={dados[campo] || ''} onChange={handleChange} />
                ) : (
                  <span>{dados[campo] || "Não informado"}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Botões de edição */}
        {!token && editando && (
          <div className="botoes-edicao">
            <button onClick={salvar}>Salvar</button>
            <button onClick={cancelar}>Cancelar</button>
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
