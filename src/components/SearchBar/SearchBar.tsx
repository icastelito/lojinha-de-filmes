import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const isFirstRender = useRef(true);

  // Debounce para não fazer requisições a cada tecla
  useEffect(() => {
    // Evita executar no primeiro render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (query.trim() === '') {
      onClear();
      return;
    }

    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 500); // Aguarda 500ms após parar de digitar

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.inputWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Limpar busca"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
