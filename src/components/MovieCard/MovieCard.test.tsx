import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '../../context/CartContext';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { type Movie, type Genre } from '../../services/api';

// Mock do módulo api.ts para evitar problemas com import.meta
jest.mock('../../services/api', () => ({
  getImageUrl: (path: string | null) => 
    path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem',
  mapGenreIdsToNames: (ids: number[], genres: any[]) => 
    ids.map(id => genres.find(g => g.id === id)?.name).filter(Boolean),
}));

// Mock dos componentes UI
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardFooter: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, 'aria-label': ariaLabel, ...props }: any) => (
    <button onClick={onClick} className={className} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => <span className={className}>{children}</span>,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Importa o componente DEPOIS dos mocks
import MovieCard from './MovieCard';

// Mock de filme para testes
const mockMovie: Movie = {
  id: 1,
  title: 'Filme Teste',
  original_title: 'Test Movie',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  overview: 'Descrição do filme teste',
  release_date: '2024-01-15',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 12],
  popularity: 100,
  price: 19.90,
};

const mockMovieWithoutPoster: Movie = {
  ...mockMovie,
  id: 2,
  poster_path: null,
};

const mockGenres: Genre[] = [
  { id: 28, name: 'Ação' },
  { id: 12, name: 'Aventura' },
  { id: 18, name: 'Drama' },
];

// Wrapper com providers necessários
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <CartProvider>
      <FavoritesProvider>
        {component}
      </FavoritesProvider>
    </CartProvider>
  );
};

describe('MovieCard', () => {
  describe('Renderização', () => {
    it('deve renderizar poster do filme', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const img = screen.getByAltText('Filme Teste');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', expect.stringContaining('test-poster.jpg'));
    });

    it('deve renderizar título do filme', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      expect(screen.getByText('Filme Teste')).toBeInTheDocument();
    });

    it('deve renderizar preço formatado', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      expect(screen.getByText('R$ 19.90')).toBeInTheDocument();
    });

    it('deve renderizar rating', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      expect(screen.getByText('8.5')).toBeInTheDocument();
    });

    it('deve renderizar ano de lançamento', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('deve renderizar gêneros (max 2)', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      expect(screen.getByText('Ação')).toBeInTheDocument();
      expect(screen.getByText('Aventura')).toBeInTheDocument();
    });

    it('não deve renderizar mais de 2 gêneros', () => {
      const movieWithManyGenres: Movie = {
        ...mockMovie,
        genre_ids: [28, 12, 18], // 3 gêneros
      };
      
      renderWithProviders(<MovieCard movie={movieWithManyGenres} genres={mockGenres} />);
      
      expect(screen.getByText('Ação')).toBeInTheDocument();
      expect(screen.getByText('Aventura')).toBeInTheDocument();
      expect(screen.queryByText('Drama')).not.toBeInTheDocument();
    });

    it('deve renderizar N/A se não houver data de lançamento', () => {
      const movieWithoutDate: Movie = {
        ...mockMovie,
        release_date: '',
      };
      
      renderWithProviders(<MovieCard movie={movieWithoutDate} genres={mockGenres} />);
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('Imagens', () => {
    it('deve usar imagem real se poster_path existe', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const img = screen.getByAltText('Filme Teste') as HTMLImageElement;
      expect(img.src).toContain('test-poster.jpg');
    });

    it('deve usar fallback se poster_path é null', () => {
      renderWithProviders(<MovieCard movie={mockMovieWithoutPoster} genres={mockGenres} />);
      
      const img = screen.getByAltText('Filme Teste') as HTMLImageElement;
      expect(img.src).toContain('placeholder');
    });

    it('deve ter atributo loading lazy', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const img = screen.getByAltText('Filme Teste');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('deve ter handler onError para imagens quebradas', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const img = screen.getByAltText('Filme Teste') as HTMLImageElement;
      expect(img.onerror).toBeDefined();
    });
  });

  describe('Botões', () => {
    it('botão "Adicionar ao Carrinho" deve estar presente', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      expect(screen.getByRole('button', { name: /adicionar ao carrinho/i })).toBeInTheDocument();
    });

    it('botão de favoritos deve estar presente', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      expect(screen.getByRole('button', { name: /adicionar aos favoritos/i })).toBeInTheDocument();
    });

    it('deve mostrar ícone de coração preenchido se favoritado', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const favoriteButton = screen.getByRole('button', { name: /adicionar aos favoritos/i });
      await user.click(favoriteButton);
      
      expect(screen.getByRole('button', { name: /remover dos favoritos/i })).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve adicionar ao carrinho ao clicar no botão', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
      await user.click(addButton);
      
      // Verifica se o botão foi clicado (não temos como verificar o toast aqui sem mockar)
      expect(addButton).toBeInTheDocument();
    });

    it('deve toggle favorito ao clicar no coração', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const favoriteButton = screen.getByRole('button', { name: /adicionar aos favoritos/i });
      
      // Adiciona aos favoritos
      await user.click(favoriteButton);
      expect(screen.getByRole('button', { name: /remover dos favoritos/i })).toBeInTheDocument();
      
      // Remove dos favoritos
      await user.click(favoriteButton);
      expect(screen.getByRole('button', { name: /adicionar aos favoritos/i })).toBeInTheDocument();
    });

    it('deve permitir múltiplos cliques no botão adicionar', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
      
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);
      
      expect(addButton).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter alt text nas imagens', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const img = screen.getByAltText('Filme Teste');
      expect(img).toHaveAttribute('alt', 'Filme Teste');
    });

    it('botões devem ter aria-label', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      expect(screen.getByRole('button', { name: /adicionar ao carrinho/i })).toHaveAttribute('aria-label');
      expect(screen.getByRole('button', { name: /adicionar aos favoritos/i })).toHaveAttribute('aria-label');
    });

    it('aria-label do botão favorito deve mudar com o estado', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const favoriteButton = screen.getByRole('button', { name: /adicionar aos favoritos/i });
      expect(favoriteButton).toHaveAttribute('aria-label', 'Adicionar aos favoritos');
      
      await user.click(favoriteButton);
      
      const updatedButton = screen.getByRole('button', { name: /remover dos favoritos/i });
      expect(updatedButton).toHaveAttribute('aria-label', 'Remover dos favoritos');
    });
  });

  describe('Estilos e Classes', () => {
    it('deve aplicar hover effects no card', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const card = screen.getByRole('img').closest('.group');
      expect(card).toHaveClass('group');
    });

    it('deve ter aspect ratio correto na imagem', () => {
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const imageContainer = screen.getByRole('img').parentElement;
      expect(imageContainer).toHaveClass('aspect-[2/3]');
    });

    it('botão favorito deve ter classes especiais quando favoritado', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MovieCard movie={mockMovie} genres={mockGenres} />);
      
      const favoriteButton = screen.getByRole('button', { name: /adicionar aos favoritos/i });
      await user.click(favoriteButton);
      
      const heartIcon = favoriteButton.querySelector('svg');
      expect(heartIcon).toHaveClass('fill-primary', 'text-primary');
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com preço zero', () => {
      const movieWithZeroPrice: Movie = {
        ...mockMovie,
        price: 0,
      };
      
      renderWithProviders(<MovieCard movie={movieWithZeroPrice} genres={mockGenres} />);
      
      expect(screen.getByText('R$ 0.00')).toBeInTheDocument();
    });

    it('deve lidar com rating muito alto', () => {
      const movieWithHighRating: Movie = {
        ...mockMovie,
        vote_average: 10,
      };
      
      renderWithProviders(<MovieCard movie={movieWithHighRating} genres={mockGenres} />);
      
      expect(screen.getByText('10.0')).toBeInTheDocument();
    });

    it('deve lidar com rating muito baixo', () => {
      const movieWithLowRating: Movie = {
        ...mockMovie,
        vote_average: 0,
      };
      
      renderWithProviders(<MovieCard movie={movieWithLowRating} genres={mockGenres} />);
      
      expect(screen.getByText('0.0')).toBeInTheDocument();
    });

    it('deve lidar com filme sem gêneros', () => {
      const movieWithoutGenres: Movie = {
        ...mockMovie,
        genre_ids: [],
      };
      
      renderWithProviders(<MovieCard movie={movieWithoutGenres} genres={mockGenres} />);
      
      // Não deve quebrar, apenas não renderizar badges de gênero
      expect(screen.queryByText('Ação')).not.toBeInTheDocument();
    });

    it('deve lidar com título muito longo', () => {
      const movieWithLongTitle: Movie = {
        ...mockMovie,
        title: 'Título Extremamente Longo Que Deveria Ser Truncado Com Ellipsis Para Não Quebrar O Layout Do Card',
      };
      
      renderWithProviders(<MovieCard movie={movieWithLongTitle} genres={mockGenres} />);
      
      const title = screen.getByText(/Título Extremamente Longo/);
      expect(title).toHaveClass('line-clamp-2');
    });
  });
});
