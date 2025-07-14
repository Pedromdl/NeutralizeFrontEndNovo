import { useState } from 'react';
import axios from 'axios';
import '../components/css/Cadastro.css';


function CadastrarPaciente() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    data_de_nascimento: '',
  });

  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/`, formData);
      setMensagem('Paciente cadastrado com sucesso!');
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        data_de_nascimento: '',
      });
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao cadastrar paciente.');
    }
  };

  return (
    <div className="conteudo">
      <div className="card">
        <h2>Cadastrar Novo Paciente</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="form-input" required />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input type="date" name="data_de_nascimento" value={formData.data_de_nascimento} onChange={handleChange} className="form-input" />
          </div>
          <button type="submit" className="btn">Cadastrar</button>
        </form>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
}

export default CadastrarPaciente;
