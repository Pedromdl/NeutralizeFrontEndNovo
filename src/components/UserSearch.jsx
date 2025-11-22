import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import './css/UserSearch.css';

function UserSearch({ onSelect, modoModal = false, valorInicial = '' }) {
  const [inputValue, setInputValue] = useState(valorInicial);
  const [resultados, setResultados] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios/`);

        const filtrados = res.data.filter(usuario =>
          usuario.nome.toLowerCase().includes(inputValue.toLowerCase())
        );
        setResultados(filtrados);
        setMostrarDropdown(true);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      } finally {
        setLoading(false);
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
      onSelect(usuario);
    }
  };

  const handleFocus = () => {
    if (inputValue && resultados.length > 0) {
      setMostrarDropdown(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setMostrarDropdown(false), 150);
  };

  return (
    <div className={`user-search-container ${modoModal ? 'modal' : ''}`}>
      <div className="search-input-wrapper">
        <Search size={20} />
        <input
          type="text"
          placeholder="Buscar usuário..."
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="search-input-simple"
        />
        {loading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
      
      {mostrarDropdown && resultados.length > 0 && (
        <ul className="search-dropdown">
          {resultados.map((usuario) => (
            <li 
              key={usuario.id} 
              onClick={() => handleSelect(usuario)}
              className="dropdown-item"
            >
              <div className="user-info">
                <span className="user-name">{usuario.nome}</span>
                {usuario.email && (
                  <span className="user-email">{usuario.email}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {mostrarDropdown && inputValue && resultados.length === 0 && !loading && (
        <div className="search-empty">
          Nenhum usuário encontrado para "{inputValue}"
        </div>
      )}
    </div>
  );
}

export default UserSearch;