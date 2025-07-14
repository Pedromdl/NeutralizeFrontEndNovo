import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';
import '../../components/css/DadosUsuario.css';

export default function DadosUsuario({ usuarioSelecionado, atualizarUsuario }) {
  const [editando, setEditando] = useState(false);
  const [dados, setDados] = useState({ ...usuarioSelecionado });

  // Atualiza os dados sempre que o usuário selecionado mudar
  useEffect(() => {
    setDados({ ...usuarioSelecionado });
  }, [usuarioSelecionado]);

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 'Não informada';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
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
    setDados({ ...usuarioSelecionado }); // Reverte para dados anteriores
    setEditando(false);
  };

  return (
    <Card title="Dados do Usuário" size="al">
      <div className="dados-usuario">
        {editando ? (
          <>
            <div className="campo">
              <label>Nome:</label>
              <input name="nome" value={dados.nome} onChange={handleChange} />
            </div>
            <div className="campo">
              <label>Email:</label>
              <input name="email" value={dados.email} onChange={handleChange} />
            </div>
            <div className="campo">
              <label>Telefone:</label>
              <input name="telefone" value={dados.telefone || ''} onChange={handleChange} />
            </div>
            <div className="campo">
              <label>Endereço:</label>
              <input name="endereço" value={dados.endereço || ''} onChange={handleChange} />
            </div>
            <div className="campo">
              <label>Data de Nascimento:</label>
              <input
                name="data_de_nascimento"
                type="date"
                value={dados.data_de_nascimento || ''}
                onChange={handleChange}
              />
            </div>

            <div className="botoes-edicao">
              <button onClick={salvar}>Salvar</button>
              <button onClick={cancelar}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Nome:</strong> {dados.nome}</p>
            <p><strong>Email:</strong> {dados.email}</p>
            <p><strong>Telefone:</strong> {dados.telefone || 'Não informado'}</p>
            <p><strong>Endereço:</strong> {dados.endereço || 'Não informado'}</p>
            <p><strong>Data de Nascimento:</strong> {dados.data_de_nascimento
              ? new Date(dados.data_de_nascimento).toLocaleDateString()
              : 'Não informada'}</p>
            <p><strong>Idade:</strong> {calcularIdade(dados.data_de_nascimento)}</p>
            <div className="botoes-edicao">
              <button onClick={() => setEditando(true)}>Editar</button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
