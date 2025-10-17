import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    // Carrega do localStorage se existir
    const savedFavorites = localStorage.getItem('movieFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Salva no localStorage sempre que os favoritos mudarem
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movieId: number) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(movieId)) {
        // Remove dos favoritos
        return prevFavorites.filter((id) => id !== movieId);
      } else {
        // Adiciona aos favoritos
        return [...prevFavorites, movieId];
      }
    });
  };

  const isFavorite = (movieId: number) => {
    return favorites.includes(movieId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
