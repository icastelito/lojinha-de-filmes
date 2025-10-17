import { ShoppingCart, Heart, Star } from 'lucide-react';
import { getImageUrl, type Movie, type Genre, mapGenreIdsToNames } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  genres: Genre[];
}

function MovieCard({ movie, genres }: MovieCardProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleAddToCart = () => {
    addToCart(movie);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(movie.id);
  };

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const genreNames = mapGenreIdsToNames(movie.genre_ids, genres);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=Sem+Imagem';
          }}
        />
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
            favorite && "opacity-100"
          )}
          onClick={handleToggleFavorite}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart 
            className={cn(
              "h-4 w-4",
              favorite && "fill-primary text-primary"
            )} 
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2 min-h-[2.5rem]">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3 fill-accent text-accent" />
            {movie.vote_average.toFixed(1)}
          </Badge>
          <span>{year}</span>
        </div>

        {genreNames.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {genreNames.slice(0, 2).map((genreName) => (
              <Badge key={genreName} variant="outline" className="text-xs">
                {genreName}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">
          R$ {movie.price.toFixed(2)}
        </span>
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="gap-2"
          aria-label="Adicionar ao carrinho"
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MovieCard;
