import { Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { getImageUrl, type Movie } from '@/services/api';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface FavoritesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export const FavoritesSidebar = ({ open, onOpenChange }: FavoritesSidebarProps) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [favoritedMovies, setFavoritedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar detalhes dos filmes favoritos
  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (favorites.length === 0) {
        setFavoritedMovies([]);
        return;
      }

      setLoading(true);
      try {
        const moviePromises = favorites.map(async (id) => {
          const response = await axios.get(`${BASE_URL}/movie/${id}`, {
            params: {
              api_key: API_KEY,
              language: 'pt-BR',
            },
          });
          
          // Adicionar preço fictício
          const movie = response.data;
          const basePrice = 9.9;
          const maxPrice = 49.9;
          const normalizedPopularity = Math.min(movie.popularity / 100, 1);
          const price = basePrice + (maxPrice - basePrice) * normalizedPopularity;
          
          return {
            ...movie,
            price: parseFloat(price.toFixed(2)),
          };
        });

        const movies = await Promise.all(moviePromises);
        setFavoritedMovies(movies);
      } catch (error) {
        console.error('Erro ao buscar filmes favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchFavoriteMovies();
    }
  }, [favorites, open]);

  const handleAddToCart = (movie: Movie) => {
    addToCart(movie);
    // Opcional: mostrar feedback visual
  };

  const handleRemoveFavorite = (movieId: number) => {
    toggleFavorite(movieId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            Meus Favoritos
          </SheetTitle>
          <SheetDescription>
            {favorites.length === 0 
              ? 'Você ainda não tem favoritos' 
              : `${favorites.length} ${favorites.length === 1 ? 'filme favorito' : 'filmes favoritos'}`
            }
          </SheetDescription>
        </SheetHeader>

        {favorites.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <Heart className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              Você ainda não favoritou nenhum filme.<br />
              Explore e adicione seus favoritos!
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Explorar Filmes
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                favoritedMovies.map((movie) => (
                  <div key={movie.id} className="flex gap-4 group">
                    <div className="relative w-20 h-28 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <img
                        src={getImageUrl(movie.poster_path, 'w200')}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=Sem+Imagem';
                        }}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold line-clamp-2 text-sm">
                          {movie.title}
                        </h4>
                        <p className="text-sm text-primary font-bold mt-1">
                          R$ {movie.price.toFixed(2)}
                        </p>
                        {movie.vote_average > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              ⭐ {movie.vote_average.toFixed(1)}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                          onClick={() => handleAddToCart(movie)}
                        >
                          Adicionar ao Carrinho
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveFavorite(movie.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator />

            <div className="space-y-2 pt-4">
              <Button 
                onClick={() => {
                  onOpenChange(false);
                  navigate('/');
                }} 
                variant="outline" 
                className="w-full"
              >
                Continuar Explorando
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FavoritesSidebar;
