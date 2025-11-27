import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import styles from './css/UserSearch.module.css';

function UserSearch({ onSelect, modoModal = false, valorInicial = '' }) {
  const [inputValue, setInputValue] = useState(valorInicial);
  const [resultados, setResultados] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

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

    const timeout = setTimeout(buscarUsuarios, 300);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <div className={`${styles.container} ${modoModal ? styles.modal : ''}`}>
      <div className={styles.searchInputWrapper}>
        <Search size={20} className={styles.searchIcon} />

        <input
          type="text"
          placeholder="Buscar usuário..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => resultados.length > 0 && setMostrarDropdown(true)}
          onBlur={() => setTimeout(() => setMostrarDropdown(false), 150)}
          className={styles.searchInput}
        />

        {loading && (
          <div className={styles.searchLoading}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </div>

      {mostrarDropdown && resultados.length > 0 && (
        <ul className={styles.dropdown}>
          {resultados.map((usuario) => (
            <li
              key={usuario.id}
              onClick={() => {
                setInputValue(usuario.nome);
                setMostrarDropdown(false);
                onSelect?.(usuario);
              }}
              className={styles.dropdownItem}
            >
              <div className={styles.userInfo}>
                <span className={styles.userName}>{usuario.nome}</span>
                {usuario.email && (
                  <span className={styles.userEmail}>{usuario.email}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {mostrarDropdown && resultados.length === 0 && !loading && (
        <div className={styles.empty}>
          Nenhum usuário encontrado para "{inputValue}"
        </div>
      )}
    </div>
  );
}

export default UserSearch;
