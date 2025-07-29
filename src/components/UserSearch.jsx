import { useState, useEffect } from 'react';
import axios from 'axios';
import './css/UserSearch.css';

function UserSearch({ onSelect, modoModal = false, valorInicial = '' }) {
  const [inputValue, setInputValue] = useState(valorInicial);
  const [resultados, setResultados] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  // Atualiza inputValue se valorInicial mudar (ex: abrir modal edição)
  useEffect(() => {
    setInputValue(valorInicial);
  }, [valorInicial]);

  useEffect(() => {
    const buscarUsuarios = async () => {
      if (inputValue.length === 0) {
        setResultados([]);
        setMostrarDropdown(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios/`);

        const filtrados = res.data.filter(usuario =>
          usuario.nome.toLowerCase().includes(inputValue.toLowerCase())
        );
        setResultados(filtrados);
        setMostrarDropdown(true);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      }
    };

    const timeout = setTimeout(buscarUsuarios, 300); // debounce
    return () => clearTimeout(timeout);
  }, [inputValue]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSelect = (usuario) => {
    setInputValue(usuario.nome);
    setResultados([]);
    setMostrarDropdown(false);
    if (onSelect) {
      onSelect(usuario); // envia o usuário selecionado para o componente pai
    }
  };

  return (
    <div className={`user-search ${modoModal ? 'modal' : ''}`}>
      <input
        type="text"
        placeholder="Buscar usuário..."
        value={inputValue}
        onChange={handleChange}
        onFocus={() => inputValue && setMostrarDropdown(true)}
        onBlur={() => setTimeout(() => setMostrarDropdown(false), 100)}
        className={modoModal ? 'input-modal' : ''}
      />
      {mostrarDropdown && resultados.length > 0 && (
        <ul className="dropdown">
          {resultados.map((usuario) => (
            <li key={usuario.id} onClick={() => handleSelect(usuario)}>
              {usuario.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserSearch;
