import { useState } from 'react';
import axios from 'axios';
import styles from './Cadastro.module.css';

function CadastrarPaciente() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data_de_nascimento: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
  });

  const [mensagem, setMensagem] = useState('');

  const buscarEnderecoPorCep = async () => {
    const cep = formData.cep.replace(/\D/g, '');

    if (cep.length !== 8) return;

    try {
      const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (!res.data.erro) {
        setFormData(prev => ({
          ...prev,
          rua: res.data.logradouro,
          bairro: res.data.bairro,
          cidade: res.data.localidade,
          estado: res.data.uf,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ---------- MASK CPF ----------
    if (name === "cpf") {
      let digits = value.replace(/\D/g, "").slice(0, 11);

      let cpfFormatado = digits;
      if (digits.length > 3) cpfFormatado = digits.slice(0, 3) + "." + digits.slice(3);
      if (digits.length > 6)
        cpfFormatado =
          digits.slice(0, 3) +
          "." +
          digits.slice(3, 6) +
          "." +
          digits.slice(6);
      if (digits.length > 9)
        cpfFormatado =
          digits.slice(0, 3) +
          "." +
          digits.slice(3, 6) +
          "." +
          digits.slice(6, 9) +
          "-" +
          digits.slice(9);

      setFormData((prev) => ({
        ...prev,
        cpf: cpfFormatado,
      }));
      return;
    }

    // ---------- MASK TELEFONE ----------
    if (name === "telefone") {
      let digits = value.replace(/\D/g, "").slice(0, 11);

      let telefoneFormatado = digits;

      if (digits.length > 2)
        telefoneFormatado = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

      if (digits.length > 7) {
        telefoneFormatado = `(${digits.slice(0, 2)}) ${digits.slice(
          2,
          digits.length - 4
        )}-${digits.slice(-4)}`;
      }

      setFormData((prev) => ({
        ...prev,
        telefone: telefoneFormatado,
      }));
      return;
    }

    // ---------- MASK CEP ----------
    if (name === "cep") {
      const cepLimpo = value.replace(/\D/g, "").slice(0, 8);
      const cepFormatado =
        cepLimpo.length > 5
          ? `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`
          : cepLimpo;

      setFormData((prev) => ({
        ...prev,
        cep: cepFormatado,
      }));

      return;
    }

    // ---------- CAMPOS PADRÃO ----------
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios/`, formData);

      setMensagem("Paciente cadastrado com sucesso!");

      // Limpar formulário corretamente
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        data_de_nascimento: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        complemento: '',
      });

    } catch (error) {
      console.error(error);
      setMensagem("Erro ao cadastrar paciente.");
    }
  };

  return (
    <div className={styles.conteudoCadastro}>
      <div className={styles.card}>
        <h2>Ficha de Cadastro</h2>
        <form onSubmit={handleSubmit}>

          {/* DADOS PESSOAIS */}
          <h3 className={styles.secaoTitulo}>Dados Pessoais</h3>

          {/* Nome sozinho */}
          <div className={styles.grid1}>
            <div className={`${styles.formGroup} ${styles.grande}`}>
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>
          </div>

          {/* CPF + Data de Nascimento */}
          <div className={styles.grid2}>
            <div className={`${styles.formGroup} ${styles.medio}`}>
              <label>CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.medio}`}>
              <label>Data de Nascimento</label>
              <input
                type="date"
                name="data_de_nascimento"
                value={formData.data_de_nascimento}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>
          </div>

          {/* Email + Telefone */}
          <div className={styles.grid2}>
            <div className={`${styles.formGroup} ${styles.medio}`}>
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={`${styles.formGroup} ${styles.medio}`}>
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>
          </div>

          {/* ENDEREÇO */}
          <h3 className={styles.secaoTitulo}>Endereço</h3>

          <div className={styles.grid3}>
            <div className={`${styles.formGroup} ${styles.pequeno}`}>
              <label>CEP</label>
              <input 
                type="text" 
                name="cep" 
                value={formData.cep} 
                onChange={handleChange} 
                className={styles.formInput} 
                onBlur={buscarEnderecoPorCep} 
              />
            </div>

            <div className={`${styles.formGroup} ${styles.grande}`}>
              <label>Rua</label>
              <input 
                type="text" 
                name="rua" 
                value={formData.rua} 
                onChange={handleChange} 
                className={styles.formInput} 
              />
            </div>

            <div className={`${styles.formGroup} ${styles.pequeno}`}>
              <label>Número</label>
              <input 
                type="text" 
                name="numero" 
                value={formData.numero} 
                onChange={handleChange} 
                className={styles.formInput} 
              />
            </div>

            <div className={`${styles.formGroup} ${styles.medio}`}>
              <label>Bairro</label>
              <input 
                type="text" 
                name="bairro" 
                value={formData.bairro} 
                onChange={handleChange} 
                className={styles.formInput} 
              />
            </div>

            <div className={`${styles.formGroup} ${styles.medio}`}>
              <label>Cidade</label>
              <input 
                type="text" 
                name="cidade" 
                value={formData.cidade} 
                onChange={handleChange} 
                className={styles.formInput} 
              />
            </div>

            <div className={`${styles.formGroup} ${styles.pequeno}`}>
              <label>Estado</label>
              <input 
                type="text" 
                name="estado" 
                value={formData.estado} 
                onChange={handleChange} 
                className={styles.formInput} 
                maxLength={2} 
              />
            </div>

                      <div className={`${styles.formGroup} ${styles.grande}`}>
            <label>Complemento</label>
            <input 
              type="text" 
              name="complemento" 
              value={formData.complemento} 
              onChange={handleChange} 
              className={styles.formInput} 
            />
          </div>

          </div>
          


          <button type="submit" className={styles.btn}>Cadastrar</button>

          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
        </form>
      </div>
    </div>
  );
}

export default CadastrarPaciente;