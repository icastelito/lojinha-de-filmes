import axios, { type AxiosInstance } from 'axios';

// Configuração base da API TMDb
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

// Interfaces
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: Genre[];
  price: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetailsResponse extends Movie {
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
}

// Instância do Axios configurada
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
});

// Helper para construir URLs de imagens
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg'; // Fallback para imagem não encontrada
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Helper para gerar preço fictício baseado na popularidade
export const generatePrice = (popularity: number): number => {
  // Preços entre R$ 9,90 e R$ 49,90 baseados na popularidade
  const basePrice = 9.9;
  const maxPrice = 49.9;
  const normalizedPopularity = Math.min(popularity / 100, 1);
  const price = basePrice + (maxPrice - basePrice) * normalizedPopularity;
  return parseFloat(price.toFixed(2));
};

/**
 * Mapeia IDs de gêneros para nomes
 * @param {number[]} genreIds - Array de IDs de gêneros
 * @param {Genre[]} genres - Lista completa de gêneros
 * @returns {string[]} - Array de nomes de gêneros
 */
export const mapGenreIdsToNames = (genreIds: number[] | undefined, genres: Genre[]): string[] => {
  if (!genreIds || genreIds.length === 0) return [];
  
  return genreIds
    .map(id => genres.find(genre => genre.id === id)?.name)
    .filter((name): name is string => name !== undefined);
};

/**
 * Busca filmes populares
 * @param {number} page - Número da página (padrão: 1)
 * @returns {Promise<MoviesResponse>} - Lista de filmes populares
 */
export const getPopularMovies = async (page: number = 1): Promise<MoviesResponse> => {
  try {
    const response = await api.get<MoviesResponse>('/movie/popular', {
      params: { page },
    });

    // Adiciona preço fictício aos filmes
    const moviesWithPrice = response.data.results.map((movie) => ({
      ...movie,
      price: generatePrice(movie.popularity),
    }));

    return {
      ...response.data,
      results: moviesWithPrice,
    };
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    throw new Error('Não foi possível carregar os filmes populares. Tente novamente.');
  }
};

/**
 * Busca filmes por termo de pesquisa
 * @param {string} query - Termo de pesquisa
 * @param {number} page - Número da página (padrão: 1)
 * @returns {Promise<MoviesResponse>} - Lista de filmes encontrados
 */
export const searchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Digite algo para pesquisar');
    }

    const response = await api.get<MoviesResponse>('/search/movie', {
      params: {
        query: query.trim(),
        page,
      },
    });

    // Adiciona preço fictício aos filmes
    const moviesWithPrice = response.data.results.map((movie) => ({
      ...movie,
      price: generatePrice(movie.popularity || 50), // Popularidade padrão se não existir
    }));

    return {
      ...response.data,
      results: moviesWithPrice,
    };
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    if (error instanceof Error && error.message === 'Digite algo para pesquisar') {
      throw error;
    }
    throw new Error('Não foi possível realizar a busca. Tente novamente.');
  }
};

/**
 * Obtém detalhes de um filme específico
 * @param {number} movieId - ID do filme
 * @returns {Promise<MovieDetailsResponse>} - Detalhes completos do filme
 */
export const getMovieDetails = async (movieId: number): Promise<MovieDetailsResponse> => {
  try {
    if (!movieId) {
      throw new Error('ID do filme não fornecido');
    }

    const response = await api.get<MovieDetailsResponse>(`/movie/${movieId}`);

    // Adiciona preço fictício
    const movieWithPrice = {
      ...response.data,
      price: generatePrice(response.data.popularity),
    };

    return movieWithPrice;
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Filme não encontrado');
    }
    throw new Error('Não foi possível carregar os detalhes do filme. Tente novamente.');
  }
};

// Cache de gêneros para evitar múltiplas requisições
let genresCache: Genre[] | null = null;

/**
 * Busca gêneros de filmes
 * @returns {Promise<Genre[]>} - Lista de gêneros
 */
export const getMovieGenres = async (): Promise<Genre[]> => {
  if (genresCache) {
    return genresCache;
  }
  
  try {
    const response = await api.get<{ genres: Genre[] }>('/genre/movie/list');
    genresCache = response.data.genres;
    return genresCache;
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    throw new Error('Não foi possível carregar os gêneros.');
  }
};

export default api;
