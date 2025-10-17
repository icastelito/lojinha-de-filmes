import { useState, useEffect, useCallback } from 'react';
import { getPopularMovies, searchMovies, getMovieGenres, type Movie, type Genre } from '../../services/api';
import Header from '../../components/Header/Header';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import MovieGridSkeleton from '../../components/MovieGrid/MovieGridSkeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface HomeProps {
  onCartClick: () => void;
  onFavoritesClick: () => void;
}

function Home({ onCartClick, onFavoritesClick }: HomeProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPopularMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearchQuery('');
    setCurrentPage(1);
    
    try {
      const data = await getPopularMovies(1);
      setMovies(data.results);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar filmes');
      console.error('Erro ao carregar filmes populares:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega mais filmes (infinite scroll)
  const loadMoreMovies = useCallback(async () => {
    if (loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const data = searchQuery 
        ? await searchMovies(searchQuery, nextPage)
        : await getPopularMovies(nextPage);
      
      setMovies(prev => [...prev, ...data.results]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < data.total_pages);
    } catch (err) {
      console.error('Erro ao carregar mais filmes:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, loadingMore, searchQuery]);

  // Carrega filmes populares inicialmente
  useEffect(() => {
    loadPopularMovies();
  }, [loadPopularMovies]);

  // Carrega gêneros uma vez
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresList = await getMovieGenres();
        setGenres(genresList);
      } catch (err) {
        console.error('Erro ao carregar gêneros:', err);
      }
    };
    
    loadGenres();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSearchQuery(query);
    setCurrentPage(1);

    try {
      const data = await searchMovies(query, 1);
      setMovies(data.results);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar filmes');
      console.error('Erro ao buscar filmes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    loadPopularMovies();
  }, [loadPopularMovies]);

  // Infinite Scroll hook
  const sentinelRef = useInfiniteScroll({
    loading: loadingMore,
    hasMore,
    onLoadMore: loadMoreMovies,
    threshold: 500, // Carrega quando está a 500px do fim
  });

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCartClick={onCartClick}
        onFavoritesClick={onFavoritesClick}
        onSearch={handleSearch} 
        onClearSearch={handleClearSearch}
      />
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 bg-destructive/10 border border-destructive/20 rounded-lg mb-8">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
            <Button onClick={loadPopularMovies} variant="destructive">
              Tentar Novamente
            </Button>
          </div>
        )}

        {loading ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {searchQuery ? `Buscando "${searchQuery}"...` : 'Carregando Filmes Populares...'}
              </h2>
            </div>
            <MovieGridSkeleton count={20} />
          </>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Filmes Populares'}
              </h2>
              <p className="text-muted-foreground">
                {movies.length} {movies.length === 1 ? 'filme encontrado' : 'filmes encontrados'}
                {hasMore && ' (role para carregar mais)'}
              </p>
            </div>
            
            <MovieGrid 
              movies={movies} 
              genres={genres}
              emptyMessage={searchQuery ? `Nenhum filme encontrado para "${searchQuery}"` : 'Nenhum filme disponível'} 
            />

            {/* Skeleton para carregamento de mais filmes (Infinite Scroll) */}
            {loadingMore && (
              <div className="mt-8">
                <MovieGridSkeleton count={20} />
              </div>
            )}

            {/* Elemento sentinela para Infinite Scroll */}
            <div 
              ref={sentinelRef} 
              className="min-h-[100px] flex flex-col items-center justify-center my-8"
            >
              {!loadingMore && hasMore && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <span className="text-sm font-medium">↓ Role para carregar mais ↓</span>
                  <span className="text-xs">Página atual: {currentPage}</span>
                </div>
              )}
            </div>

            {/* Mensagem quando não há mais filmes */}
            {!hasMore && movies.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Você viu todos os filmes disponíveis! 🎬</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Home;
