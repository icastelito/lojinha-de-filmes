import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Movie } from '../services/api';

export interface CartItem {
  movie: Movie;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  items: CartItem[]; // Alias para cart
  addToCart: (movie: Movie) => void;
  removeFromCart: (movieId: number) => void;
  updateQuantity: (movieId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      // Carrega do localStorage se existir
      const savedCart = localStorage.getItem('movieCart');
      if (!savedCart) return [];
      
      const parsed = JSON.parse(savedCart);
      
      // Migração de dados antigos para novo formato
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Verifica se é o formato antigo (tem 'id', 'title', etc diretamente)
        if (parsed[0] && 'id' in parsed[0] && !('movie' in parsed[0])) {
          console.log('Migrando dados antigos do carrinho...');
          // Limpa o localStorage com formato antigo
          localStorage.removeItem('movieCart');
          return [];
        }
        
        // Valida o formato novo
        const isValid = parsed.every((item: any) => 
          item && typeof item === 'object' && 
          'movie' in item && 
          'quantity' in item &&
          item.movie && 
          typeof item.movie === 'object'
        );
        
        if (isValid) {
          return parsed;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
      // Remove dados corrompidos
      localStorage.removeItem('movieCart');
      return [];
    }
  });

  // Salva no localStorage sempre que o carrinho mudar
  useEffect(() => {
    try {
      // Valida os dados antes de salvar
      const validCart = cart.filter(item => 
        item && 
        item.movie && 
        typeof item.movie === 'object' &&
        typeof item.quantity === 'number'
      );
      
      if (validCart.length !== cart.length) {
        console.warn('Removendo itens inválidos do carrinho');
        setCart(validCart);
        return;
      }
      
      localStorage.setItem('movieCart', JSON.stringify(cart));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [cart]);

  const addToCart = (movie: Movie) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.movie.id === movie.id);
      
      if (existingItem) {
        // Se já existe, aumenta a quantidade
        return prevCart.map((item) =>
          item.movie.id === movie.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Se não existe, adiciona ao carrinho
        return [
          ...prevCart,
          {
            movie,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (movieId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.movie.id !== movieId));
  };

  const updateQuantity = (movieId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(movieId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.movie.id === movieId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Validação para evitar erros com dados corrompidos
      if (!item || !item.movie || typeof item.movie.price !== 'number') {
        return total;
      }
      return total + item.movie.price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => {
      // Validação para evitar erros com dados corrompidos
      if (!item || typeof item.quantity !== 'number') {
        return count;
      }
      return count + item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart, // Alias para cart
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
