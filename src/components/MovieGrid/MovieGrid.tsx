import { type Movie, type Genre } from '../../services/api';
import MovieCard from '../MovieCard/MovieCard';
import { Film } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  genres: Genre[];
  emptyMessage?: string;
}

function MovieGrid({ movies, genres, emptyMessage = 'Nenhum filme encontrado' }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Film className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} genres={genres} />
      ))}
    </div>
  );
}

export default MovieGrid;
