import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart, type CartItem } from './CartContext';
import { type Movie } from '../services/api';

// Mock de filme para testes
const mockMovie1: Movie = {
  id: 1,
  title: 'Filme Teste 1',
  original_title: 'Test Movie 1',
  poster_path: '/poster1.jpg',
  backdrop_path: '/backdrop1.jpg',
  overview: 'Descrição do filme 1',
  release_date: '2024-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 12],
  popularity: 100,
  price: 19.90,
};

const mockMovie2: Movie = {
  id: 2,
  title: 'Filme Teste 2',
  original_title: 'Test Movie 2',
  poster_path: '/poster2.jpg',
  backdrop_path: '/backdrop2.jpg',
  overview: 'Descrição do filme 2',
  release_date: '2024-02-01',
  vote_average: 7.5,
  vote_count: 800,
  genre_ids: [18, 10749],
  popularity: 80,
  price: 29.90,
};

// Wrapper para renderizar hooks com Provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
  });

  describe('Provider', () => {
    it('deve renderizar children corretamente', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current).toBeDefined();
      expect(result.current.cart).toEqual([]);
    });

    it('deve carregar dados do localStorage na inicialização', () => {
      const savedCart: CartItem[] = [
        { movie: mockMovie1, quantity: 2 },
      ];
      localStorage.setItem('movieCart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].movie.id).toBe(1);
      expect(result.current.cart[0].quantity).toBe(2);
    });

    it('deve ignorar dados corrompidos do localStorage', () => {
      localStorage.setItem('movieCart', 'dados-invalidos');

      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.cart).toEqual([]);
    });

    it('deve migrar formato antigo de dados', () => {
      // Formato antigo (filme direto no array, sem estrutura CartItem)
      const oldFormat = [mockMovie1];
      localStorage.setItem('movieCart', JSON.stringify(oldFormat));

      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.cart).toEqual([]);
      // O código limpa o localStorage no formato antigo, mas depois salva []
      const saved = localStorage.getItem('movieCart');
      expect(saved).toBe('[]');
    });
  });

  describe('addToCart', () => {
    it('deve adicionar novo filme ao carrinho', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].movie.id).toBe(1);
      expect(result.current.cart[0].quantity).toBe(1);
    });

    it('deve incrementar quantidade se filme já existe', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
        result.current.addToCart(mockMovie1);
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].quantity).toBe(2);
    });

    it('deve persistir no localStorage', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
      });

      const saved = JSON.parse(localStorage.getItem('movieCart') || '[]');
      expect(saved).toHaveLength(1);
      expect(saved[0].movie.id).toBe(1);
    });

    it('deve adicionar múltiplos filmes diferentes', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
        result.current.addToCart(mockMovie2);
      });

      expect(result.current.cart).toHaveLength(2);
      expect(result.current.cart[0].movie.id).toBe(1);
      expect(result.current.cart[1].movie.id).toBe(2);
    });
  });

  describe('removeFromCart', () => {
    it('deve remover filme do carrinho', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
        result.current.addToCart(mockMovie2);
      });

      expect(result.current.cart).toHaveLength(2);

      act(() => {
        result.current.removeFromCart(1);
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].movie.id).toBe(2);
    });

    it('deve atualizar localStorage ao remover', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
        result.current.removeFromCart(1);
      });

      const saved = JSON.parse(localStorage.getItem('movieCart') || '[]');
      expect(saved).toHaveLength(0);
    });

    it('não deve fazer nada se filme não existe', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
      });

      act(() => {
        result.current.removeFromCart(999);
      });

      expect(result.current.cart).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('deve atualizar quantidade do filme', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
      });

      act(() => {
        result.current.updateQuantity(1, 5);
      });

      expect(result.current.cart[0].quantity).toBe(5);
    });

    it('deve remover se quantidade for 0', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
      });

      act(() => {
        result.current.updateQuantity(1, 0);
      });

      expect(result.current.cart).toHaveLength(0);
    });

    it('deve remover se quantidade for negativa', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
      });

      act(() => {
        result.current.updateQuantity(1, -5);
      });

      expect(result.current.cart).toHaveLength(0);
    });

    it('deve persistir no localStorage', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
        result.current.updateQuantity(1, 3);
      });

      const saved = JSON.parse(localStorage.getItem('movieCart') || '[]');
      expect(saved[0].quantity).toBe(3);
    });
  });

  describe('clearCart', () => {
    it('deve limpar todos os itens', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
        result.current.addToCart(mockMovie2);
      });

      expect(result.current.cart).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart).toHaveLength(0);
    });

    it('deve limpar localStorage', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
        result.current.clearCart();
      });

      const saved = JSON.parse(localStorage.getItem('movieCart') || '[]');
      expect(saved).toHaveLength(0);
    });
  });

  describe('getCartCount', () => {
    it('deve retornar 0 para carrinho vazio', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.getCartCount()).toBe(0);
    });

    it('deve retornar soma das quantidades', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1); // quantity: 1
        result.current.addToCart(mockMovie1); // quantity: 2
        result.current.addToCart(mockMovie2); // quantity: 1
      });

      expect(result.current.getCartCount()).toBe(3); // 2 + 1
    });

    it('deve ignorar itens inválidos', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
      });

      // Simula corrupção de dados
      act(() => {
        (result.current as any).cart.push({ movie: mockMovie2, quantity: null });
      });

      // Deve contar apenas o item válido
      expect(result.current.getCartCount()).toBe(1);
    });
  });

  describe('getCartTotal', () => {
    it('deve retornar 0 para carrinho vazio', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.getCartTotal()).toBe(0);
    });

    it('deve calcular total corretamente', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1); // 19.90
        result.current.addToCart(mockMovie1); // 19.90 * 2 = 39.80
        result.current.addToCart(mockMovie2); // 29.90
      });

      const expectedTotal = (19.90 * 2) + 29.90; // 69.70
      expect(result.current.getCartTotal()).toBeCloseTo(expectedTotal, 2);
    });

    it('deve ignorar itens sem preço válido', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
      });

      // Simula corrupção de dados
      const invalidMovie = { ...mockMovie2, price: 'invalid' as any };
      act(() => {
        (result.current as any).cart.push({ movie: invalidMovie, quantity: 1 });
      });

      // Deve calcular apenas o item válido
      expect(result.current.getCartTotal()).toBeCloseTo(19.90, 2);
    });
  });

  describe('items alias', () => {
    it('deve ter items como alias para cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockMovie1);
      });

      expect(result.current.items).toEqual(result.current.cart);
      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('useCart hook', () => {
    it('deve lançar erro se usado fora do Provider', () => {
      // Suprimir erro do console no teste
      const spy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart must be used within a CartProvider');

      spy.mockRestore();
    });
  });
});
