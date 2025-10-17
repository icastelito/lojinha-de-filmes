import { renderHook, act } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from './FavoritesContext';

// Wrapper para renderizar hooks com Provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe('FavoritesContext', () => {
  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
  });

  describe('Provider', () => {
    it('deve renderizar children corretamente', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      expect(result.current).toBeDefined();
      expect(result.current.favorites).toEqual([]);
    });

    it('deve carregar favoritos do localStorage na inicialização', () => {
      const savedFavorites = [1, 2, 3];
      localStorage.setItem('movieFavorites', JSON.stringify(savedFavorites));

      const { result } = renderHook(() => useFavorites(), { wrapper });
      expect(result.current.favorites).toEqual([1, 2, 3]);
    });

    it('deve inicializar vazio se não houver dados no localStorage', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      expect(result.current.favorites).toEqual([]);
    });

    it('deve lidar com dados corrompidos no localStorage', () => {
      localStorage.setItem('movieFavorites', 'dados-invalidos');

      // Deve lançar erro ao tentar parsear
      expect(() => {
        renderHook(() => useFavorites(), { wrapper });
      }).toThrow();
    });
  });

  describe('toggleFavorite', () => {
    it('deve adicionar filme aos favoritos', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.favorites).toContain(1);
      expect(result.current.favorites).toHaveLength(1);
    });

    it('deve remover filme dos favoritos se já existe', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.favorites).toContain(1);

      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.favorites).not.toContain(1);
      expect(result.current.favorites).toHaveLength(0);
    });

    it('deve persistir no localStorage ao adicionar', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
      });

      const saved = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
      expect(saved).toContain(1);
    });

    it('deve persistir no localStorage ao remover', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(1);
      });

      const saved = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
      expect(saved).not.toContain(1);
      expect(saved).toHaveLength(0);
    });

    it('deve adicionar múltiplos filmes diferentes', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
      });

      expect(result.current.favorites).toEqual([1, 2, 3]);
    });

    it('deve manter ordem de adição', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(5);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(8);
      });

      expect(result.current.favorites).toEqual([5, 2, 8]);
    });

    it('deve remover apenas o filme especificado', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
      });

      act(() => {
        result.current.toggleFavorite(2);
      });

      expect(result.current.favorites).toEqual([1, 3]);
    });
  });

  describe('isFavorite', () => {
    it('deve retornar true para filme favoritado', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
      });

      expect(result.current.isFavorite(1)).toBe(true);
    });

    it('deve retornar false para filme não favoritado', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      expect(result.current.isFavorite(999)).toBe(false);
    });

    it('deve retornar false após remover favorito', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(1);
      });

      expect(result.current.isFavorite(1)).toBe(false);
    });

    it('deve funcionar corretamente com múltiplos favoritos', () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
      });

      expect(result.current.isFavorite(1)).toBe(true);
      expect(result.current.isFavorite(2)).toBe(true);
      expect(result.current.isFavorite(3)).toBe(true);
      expect(result.current.isFavorite(4)).toBe(false);
    });
  });

  describe('useFavorites hook', () => {
    it('deve lançar erro se usado fora do Provider', () => {
      // Suprimir erro do console no teste
      const spy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useFavorites());
      }).toThrow('useFavorites must be used within a FavoritesProvider');

      spy.mockRestore();
    });
  });

  describe('Persistência', () => {
    it('deve persistir estado ao recarregar provider', () => {
      const { result, rerender } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
      });

      expect(result.current.favorites).toEqual([1, 2]);

      // Simula recarga do componente
      rerender();

      expect(result.current.favorites).toEqual([1, 2]);
    });

    it('deve carregar estado salvo em nova instância', () => {
      // Primeira instância
      const { result: result1 } = renderHook(() => useFavorites(), { wrapper });

      act(() => {
        result1.current.toggleFavorite(5);
      });

      // Segunda instância (simula recarga da página)
      const { result: result2 } = renderHook(() => useFavorites(), { wrapper });

      expect(result2.current.favorites).toContain(5);
    });
  });
});
