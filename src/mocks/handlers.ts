import { http, HttpResponse } from 'msw';

const mockMovies = [
  {
    id: 1,
    title: 'Filme Teste 1',
    poster_path: '/teste1.jpg',
    backdrop_path: '/backdrop1.jpg',
    overview: 'Descrição do filme teste 1',
    release_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [28, 12],
    popularity: 100,
  },
  {
    id: 2,
    title: 'Filme Teste 2',
    poster_path: '/teste2.jpg',
    backdrop_path: '/backdrop2.jpg',
    overview: 'Descrição do filme teste 2',
    release_date: '2024-02-01',
    vote_average: 7.8,
    vote_count: 800,
    genre_ids: [18, 10749],
    popularity: 80,
  },
];

const mockGenres = [
  { id: 28, name: 'Ação' },
  { id: 12, name: 'Aventura' },
  { id: 18, name: 'Drama' },
  { id: 10749, name: 'Romance' },
  { id: 35, name: 'Comédia' },
  { id: 878, name: 'Ficção científica' },
];

export const handlers = [
  // TMDb API - Popular Movies
  http.get('https://api.themoviedb.org/3/movie/popular', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;

    return HttpResponse.json({
      page,
      results: mockMovies,
      total_pages: 100,
      total_results: 2000,
    });
  }),

  // TMDb API - Search Movies
  http.get('https://api.themoviedb.org/3/search/movie', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const page = Number(url.searchParams.get('page')) || 1;

    const filteredMovies = mockMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );

    return HttpResponse.json({
      page,
      results: filteredMovies,
      total_pages: 10,
      total_results: filteredMovies.length,
    });
  }),

  // TMDb API - Movie Genres
  http.get('https://api.themoviedb.org/3/genre/movie/list', () => {
    return HttpResponse.json({
      genres: mockGenres,
    });
  }),

  // TMDb API - Movie Details
  http.get('https://api.themoviedb.org/3/movie/:id', ({ params }) => {
    const movieId = Number(params.id);
    const movie = mockMovies.find((m) => m.id === movieId);

    if (!movie) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(movie);
  }),

  // ViaCEP API
  http.get('https://viacep.com.br/ws/:cep/json', ({ params }) => {
    const cep = params.cep as string;

    if (cep === '00000-000' || cep === '00000000') {
      return HttpResponse.json({ erro: true });
    }

    return HttpResponse.json({
      cep: cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2'),
      logradouro: 'Rua Teste',
      complemento: '',
      bairro: 'Centro',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107',
    });
  }),
];
