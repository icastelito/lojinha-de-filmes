# 📚 Documentação Técnica - Lojinha de Filmes

## 📖 Sumário

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Tecnologias e Dependências](#tecnologias-e-dependências)
4. [Configuração do Ambiente](#configuração-do-ambiente)
5. [Arquitetura de Componentes](#arquitetura-de-componentes)
6. [Gerenciamento de Estado](#gerenciamento-de-estado)
7. [Integração com APIs](#integração-com-apis)
8. [Roteamento](#roteamento)
9. [Estilização](#estilização)
10. [Validações e Máscaras](#validações-e-máscaras)
11. [Testes](#testes)
12. [Performance e Otimizações](#performance-e-otimizações)
13. [Fluxos da Aplicação](#fluxos-da-aplicação)
14. [Padrões de Código](#padrões-de-código)
15. [Segurança](#segurança)
16. [Deploy](#deploy)

---

## 🏗️ Visão Geral da Arquitetura

### Arquitetura Geral

A aplicação segue uma arquitetura baseada em **componentes reutilizáveis** com gerenciamento de estado via **Context API** do React. O projeto foi estruturado seguindo os princípios de:

- **Separação de Responsabilidades**: Cada camada tem uma função específica
- **Componentização**: Componentes pequenos, focados e reutilizáveis
- **Tipagem Forte**: TypeScript em todo o código para maior segurança
- **Single Source of Truth**: Estado centralizado nos Contexts

### Camadas da Aplicação

```
┌─────────────────────────────────────┐
│         Camada de UI                │
│    (Componentes React)              │
├─────────────────────────────────────┤
│    Camada de Estado                 │
│    (Context API)                    │
├─────────────────────────────────────┤
│    Camada de Serviços               │
│    (API Calls, Validações)          │
├─────────────────────────────────────┤
│    Camada de Dados                  │
│    (APIs Externas, LocalStorage)    │
└─────────────────────────────────────┘
```

---

## 📂 Estrutura de Pastas

```
lojinha-de-filmes/
│
├── public/                      # Arquivos estáticos públicos
│   └── vite.svg                # Favicon
│
├── src/
│   │
│   ├── assets/                 # Assets do projeto (imagens, ícones)
│   │   └── react.svg
│   │
│   ├── components/             # Componentes React
│   │   ├── ui/                # Componentes base do ShadCN UI
│   │   │   ├── button.tsx     # Botão reutilizável
│   │   │   ├── card.tsx       # Card container
│   │   │   ├── dialog.tsx     # Modal/Dialog
│   │   │   ├── input.tsx      # Input de formulário
│   │   │   ├── sheet.tsx      # Sidebar/Sheet
│   │   │   ├── skeleton.tsx   # Loading skeleton
│   │   │   ├── separator.tsx  # Divisor visual
│   │   │   └── badge.tsx      # Badge/Tag
│   │   │
│   │   ├── Header/            # Cabeçalho da aplicação
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   │
│   │   ├── SearchBar/         # Barra de pesquisa
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchBar.module.css
│   │   │
│   │   ├── MovieCard/         # Card individual de filme
│   │   │   ├── MovieCard.tsx
│   │   │   ├── MovieCard.module.css
│   │   │   ├── MovieCard.test.tsx
│   │   │   └── MovieCardSkeleton.tsx
│   │   │
│   │   ├── MovieGrid/         # Grid de filmes
│   │   │   ├── MovieGrid.tsx
│   │   │   ├── MovieGrid.module.css
│   │   │   └── MovieGridSkeleton.tsx
│   │   │
│   │   ├── Cart/              # Carrinho de compras
│   │   │   └── CartSidebar.tsx
│   │   │
│   │   ├── Favorites/         # Sistema de favoritos
│   │   │   └── FavoritesSidebar.tsx
│   │   │
│   │   ├── Loading/           # Componente de loading
│   │   │   ├── Loading.tsx
│   │   │   └── Loading.module.css
│   │   │
│   │   └── SuccessModal/      # Modal de sucesso
│   │       └── SuccessModal.tsx
│   │
│   ├── context/               # Context API providers
│   │   ├── CartContext.tsx    # Estado do carrinho
│   │   ├── CartContext.test.tsx
│   │   ├── FavoritesContext.tsx # Estado dos favoritos
│   │   └── FavoritesContext.test.tsx
│   │
│   ├── hooks/                 # Hooks customizados
│   │   └── useInfiniteScroll.ts
│   │
│   ├── lib/                   # Utilitários de bibliotecas
│   │   └── utils.ts           # Helpers do Tailwind
│   │
│   ├── mocks/                 # Mocks para testes
│   │   ├── handlers.ts        # Handlers do MSW
│   │   └── server.ts          # Servidor de mock
│   │
│   ├── pages/                 # Páginas da aplicação
│   │   ├── Home/              # Página inicial
│   │   │   ├── Home.tsx
│   │   │   └── Home.module.css
│   │   │
│   │   └── CheckoutPage/      # Página de checkout
│   │       └── CheckoutPage.tsx
│   │
│   ├── services/              # Serviços de integração
│   │   ├── api.ts            # Cliente TMDb API
│   │   └── viaCep.ts         # Cliente ViaCEP API
│   │
│   ├── utils/                 # Funções utilitárias
│   │   ├── validators.ts      # Validações de formulário
│   │   ├── validators.test.ts
│   │   ├── masks.ts          # Máscaras de input
│   │   └── masks.test.ts
│   │
│   ├── App.tsx               # Componente raiz
│   ├── App.css               # Estilos globais do App
│   ├── main.tsx              # Entry point
│   ├── index.css             # Estilos globais
│   ├── setupTests.ts         # Configuração de testes
│   └── vite-env.d.ts         # Types do Vite
│
├── .env                       # Variáveis de ambiente (não versionado)
├── .env.example              # Exemplo de variáveis
├── .gitignore                # Arquivos ignorados pelo Git
├── eslint.config.js          # Configuração do ESLint
├── index.html                # HTML base
├── jest.config.js            # Configuração do Jest
├── package.json              # Dependências e scripts
├── postcss.config.js         # Configuração do PostCSS
├── tailwind.config.js        # Configuração do Tailwind
├── tsconfig.json             # Configuração do TypeScript
├── tsconfig.app.json         # Config TS para aplicação
├── tsconfig.node.json        # Config TS para Node
├── vite.config.ts            # Configuração do Vite
├── README.md                 # Documentação do usuário
└── DOCUMENTACAO_TECNICA.md   # Esta documentação
```

---

## 🛠️ Tecnologias e Dependências

### Dependências de Produção

```json
{
  "@radix-ui/react-dialog": "^1.1.15",      // Base do Dialog/Modal
  "@radix-ui/react-separator": "^1.1.7",    // Separadores visuais
  "axios": "^1.12.2",                       // Cliente HTTP
  "class-variance-authority": "^0.7.1",     // Variantes de componentes
  "clsx": "^2.1.1",                         // Utilitário de classes CSS
  "lucide-react": "^0.546.0",               // Biblioteca de ícones
  "react": "^19.1.1",                       // Framework base
  "react-dom": "^19.1.1",                   // React DOM
  "react-icons": "^5.5.0",                  // Ícones adicionais
  "react-input-mask": "^2.0.4",             // Máscaras de input
  "react-router-dom": "^7.9.4",             // Roteamento
  "tailwind-merge": "^3.3.1"                // Merge de classes Tailwind
}
```

### Dependências de Desenvolvimento

```json
{
  "@eslint/js": "^9.36.0",                  // ESLint core
  "@swc/jest": "^0.2.39",                   // Transformador rápido para Jest
  "@testing-library/jest-dom": "^6.9.1",    // Matchers para Jest
  "@testing-library/react": "^16.3.0",      // Testes de componentes
  "@testing-library/user-event": "^14.6.1", // Simulação de eventos
  "@types/jest": "^30.0.0",                 // Types do Jest
  "@types/node": "^24.8.1",                 // Types do Node
  "@types/react": "^19.1.16",               // Types do React
  "@types/react-dom": "^19.1.9",            // Types do React DOM
  "@vitejs/plugin-react": "^5.0.4",         // Plugin Vite para React
  "autoprefixer": "^10.4.21",               // PostCSS autoprefixer
  "eslint": "^9.36.0",                      // Linter
  "jest": "^30.2.0",                        // Framework de testes
  "jest-environment-jsdom": "^30.2.0",      // Ambiente DOM para testes
  "msw": "^2.11.5",                         // Mock Service Worker
  "postcss": "^8.5.6",                      // Processador CSS
  "tailwindcss": "^3.4.18",                 // Framework CSS
  "typescript": "~5.8.3",                   // TypeScript
  "vite": "^6.0.11"                         // Build tool
}
```

---

## ⚙️ Configuração do Ambiente

### Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configuração sensível:

```env
# .env
VITE_TMDB_API_KEY=sua_chave_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**Importante**: 
- Todas as variáveis devem começar com `VITE_` para serem acessíveis no código
- O arquivo `.env` não deve ser versionado (está no `.gitignore`)
- Use `.env.example` como template

### TypeScript Configuration

**tsconfig.json** - Configuração base:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**tsconfig.app.json** - Configuração da aplicação:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**Recursos**:
- Alias `@` apontando para `./src`
- Plugin React para Fast Refresh
- Build otimizado para produção

---

## 🧩 Arquitetura de Componentes

### Hierarquia de Componentes

```
App
├── Router
│   ├── Home
│   │   ├── Header
│   │   │   ├── SearchBar
│   │   │   └── Buttons (Cart, Favorites)
│   │   ├── MovieGrid
│   │   │   └── MovieCard[] (com infinite scroll)
│   │   ├── CartSidebar (Sheet)
│   │   └── FavoritesSidebar (Sheet)
│   │
│   └── CheckoutPage
│       ├── Header
│       ├── Form (com validações)
│       └── OrderSummary
│           └── SuccessModal (Dialog)
│
└── Providers
    ├── CartProvider
    └── FavoritesProvider
```

### Padrões de Componentes

#### 1. **Componentes de Apresentação (UI)**

Componentes puros, sem lógica de negócio:

```typescript
// Exemplo: Button
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default',
  children,
  onClick 
}) => {
  return (
    <button 
      className={buttonVariants({ variant, size })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

#### 2. **Componentes Inteligentes (Container)**

Componentes com lógica de negócio e state:

```typescript
// Exemplo: MovieCard
export const MovieCard: React.FC<MovieCardProps> = ({ movie, genres }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const handleAddToCart = () => {
    addToCart(movie);
    toast.success('Filme adicionado ao carrinho!');
  };
  
  // Renderização...
};
```

#### 3. **Componentes de Layout**

Componentes estruturais:

```typescript
// Exemplo: MovieGrid
export const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  emptyMessage 
}) => {
  if (movies.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};
```

---

## 🔄 Gerenciamento de Estado

### Context API

A aplicação utiliza Context API para gerenciamento de estado global:

#### CartContext

```typescript
interface CartContextType {
  cart: CartItem[];
  items: CartItem[];
  addToCart: (movie: Movie) => void;
  removeFromCart: (movieId: number) => void;
  updateQuantity: (movieId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}
```

**Funcionalidades**:
- ✅ Adicionar filmes ao carrinho
- ✅ Remover filmes
- ✅ Atualizar quantidade
- ✅ Limpar carrinho
- ✅ Calcular total
- ✅ Contar itens
- ✅ Persistência em localStorage

**Uso**:
```typescript
const { addToCart, cart, getCartTotal } = useCart();

// Adicionar ao carrinho
addToCart(movie);

// Obter total
const total = getCartTotal();
```

#### FavoritesContext

```typescript
interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}
```

**Funcionalidades**:
- ✅ Toggle favorito (adicionar/remover)
- ✅ Verificar se é favorito
- ✅ Persistência em localStorage

**Uso**:
```typescript
const { toggleFavorite, isFavorite } = useFavorites();

// Toggle favorito
toggleFavorite(movie.id);

// Verificar se é favorito
const favorited = isFavorite(movie.id);
```

### LocalStorage Strategy

**Estrutura de dados**:

```typescript
// Cart
localStorage.setItem('movieCart', JSON.stringify([
  {
    movie: { id, title, poster_path, price, ... },
    quantity: 2
  }
]));

// Favorites
localStorage.setItem('movieFavorites', JSON.stringify([1, 2, 3, 4]));
```

**Migração de dados antigos**:
```typescript
// O CartContext detecta e migra automaticamente formatos antigos
if (parsed[0] && 'id' in parsed[0] && !('movie' in parsed[0])) {
  // Formato antigo detectado - limpar
  localStorage.removeItem('movieCart');
  return [];
}
```

---

## 🌐 Integração com APIs

### TMDb API

**Configuração**:

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'pt-BR',
  },
});
```

**Endpoints utilizados**:

1. **Filmes Populares**
```typescript
export const getPopularMovies = async (page: number = 1): Promise<MoviesResponse> => {
  const response = await api.get('/movie/popular', { params: { page } });
  const moviesWithPrice = response.data.results.map(addPriceToMovie);
  return { ...response.data, results: moviesWithPrice };
};
```

2. **Buscar Filmes**
```typescript
export const searchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
  const response = await api.get('/search/movie', { 
    params: { query, page } 
  });
  const moviesWithPrice = response.data.results.map(addPriceToMovie);
  return { ...response.data, results: moviesWithPrice };
};
```

3. **Detalhes do Filme**
```typescript
export const getMovieDetails = async (movieId: number): Promise<MovieDetailsResponse> => {
  const response = await api.get(`/movie/${movieId}`);
  return addPriceToMovie(response.data);
};
```

4. **Gêneros**
```typescript
export const getMovieGenres = async (): Promise<Genre[]> => {
  const response = await api.get('/genre/movie/list');
  return response.data.genres;
};
```

**Helpers**:

```typescript
// Gera URL de imagem
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Gera preço fictício baseado em popularidade
const generatePrice = (popularity: number): number => {
  const basePrice = 9.90;
  const maxPrice = 49.90;
  const normalizedPopularity = Math.min(popularity / 100, 1);
  return Number((basePrice + (normalizedPopularity * (maxPrice - basePrice))).toFixed(2));
};
```

### ViaCEP API

**Configuração**:

```typescript
// src/services/viaCep.ts
import axios from 'axios';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const buscarCEP = async (cep: string): Promise<ViaCepResponse> => {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido');
  }
  
  const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  
  if (response.data.erro) {
    throw new Error('CEP não encontrado');
  }
  
  return response.data;
};
```

**Uso no componente**:

```typescript
const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
  const cep = e.target.value;
  if (cep.replace(/\D/g, '').length === 8) {
    try {
      const data = await buscarCEP(cep);
      // Preencher campos automaticamente
      setFormData(prev => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
    } catch (error) {
      toast.error('CEP não encontrado');
    }
  }
};
```

---

## 🛣️ Roteamento

### Configuração do React Router

```typescript
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </Router>
      </FavoritesProvider>
    </CartProvider>
  );
}
```

### Navegação Programática

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navegar para checkout
const handleCheckout = () => {
  navigate('/checkout');
};

// Voltar para home
const handleBackToHome = () => {
  navigate('/');
};
```

---

## 🎨 Estilização

### Tailwind CSS

**Configuração**:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens do ShadCN
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... outros tokens
      },
      animation: {
        "accordion-down": "accordion-down 2.3s ease-out",
        "accordion-up": "accordion-up 2.3s ease-out",
      },
      transitionDuration: {
        '700': '700ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**Utilitários customizados**:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Merge de classes Tailwind evitando conflitos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Uso**:

```typescript
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className // classes externas
)} />
```

### CSS Modules

Para componentes com estilos específicos:

```css
/* MovieCard.module.css */
.card {
  @apply relative overflow-hidden rounded-lg shadow-lg;
  @apply transition-transform duration-300;
  @apply hover:scale-105 hover:shadow-xl;
}

.cardImage {
  @apply w-full h-[400px] object-cover;
}

.cardContent {
  @apply p-4 bg-gradient-to-t from-black/80 to-transparent;
}
```

```typescript
import styles from './MovieCard.module.css';

<div className={styles.card}>
  <img className={styles.cardImage} src={imageUrl} />
  <div className={styles.cardContent}>
    {/* ... */}
  </div>
</div>
```

### Design Tokens (CSS Variables)

```css
/* index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
}
```

---

## ✅ Validações e Máscaras

### Validações

**src/utils/validators.ts**:

```typescript
// Validar Email
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar CPF (com dígitos verificadores)
export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) {
    return false;
  }
  
  // Cálculo dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (parseInt(cleaned.charAt(9)) !== digit) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (parseInt(cleaned.charAt(10)) !== digit) return false;
  
  return true;
};

// Validar CEP
export const validateCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

// Validar Telefone
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11;
};

// Validar Nome Completo
export const validateFullName = (name: string): boolean => {
  return name.trim().split(' ').length >= 2;
};
```

### Máscaras

**src/utils/masks.ts**:

```typescript
// Máscara de CPF: 000.000.000-00
export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Máscara de CEP: 00000-000
export const maskCEP = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

// Máscara de Telefone: (00) 00000-0000
export const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

// Máscara de Email (lowercase)
export const maskEmail = (value: string): string => {
  return value.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
};
```

**Uso em componentes**:

```typescript
const [cpf, setCpf] = useState('');

const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const masked = maskCPF(e.target.value);
  setCpf(masked);
  
  if (validateCPF(masked)) {
    // CPF válido
  }
};
```

---

## 🧪 Testes

### Configuração do Jest

```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
};
```

### Setup de Testes

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;
```

### Mock Service Worker (MSW)

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.themoviedb.org/3/movie/popular', () => {
    return HttpResponse.json({
      page: 1,
      results: mockMovies,
      total_pages: 100,
    });
  }),
  
  http.get('https://viacep.com.br/ws/:cep/json', ({ params }) => {
    return HttpResponse.json({
      cep: params.cep,
      logradouro: 'Rua Teste',
      bairro: 'Centro',
      localidade: 'São Paulo',
      uf: 'SP',
    });
  }),
];
```

### Exemplos de Testes

**Teste de Validação**:

```typescript
// validators.test.ts
import { validateCPF, validateEmail } from './validators';

describe('validateCPF', () => {
  it('deve aceitar CPF válido', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
  });
  
  it('deve rejeitar CPF com dígitos iguais', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
  });
});
```

**Teste de Componente**:

```typescript
// MovieCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from './MovieCard';

describe('MovieCard', () => {
  it('deve renderizar informações do filme', () => {
    render(<MovieCard movie={mockMovie} genres={mockGenres} />);
    
    expect(screen.getByText('Filme Teste')).toBeInTheDocument();
    expect(screen.getByText('R$ 19,90')).toBeInTheDocument();
  });
  
  it('deve adicionar ao carrinho ao clicar', async () => {
    const user = userEvent.setup();
    render(<MovieCard movie={mockMovie} genres={mockGenres} />);
    
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    await user.click(addButton);
    
    expect(screen.getByText(/adicionado ao carrinho/i)).toBeInTheDocument();
  });
});
```

**Teste de Context**:

```typescript
// CartContext.test.tsx
describe('CartContext', () => {
  it('deve adicionar filme ao carrinho', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });
    
    act(() => {
      result.current.addToCart(mockMovie);
    });
    
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.getCartCount()).toBe(1);
  });
});
```

---

## ⚡ Performance e Otimizações

### Infinite Scroll

**Hook customizado**:

```typescript
// src/hooks/useInfiniteScroll.ts
export const useInfiniteScroll = (
  onLoadMore: () => void,
  options: {
    threshold?: number;
    loading?: boolean;
    hasMore?: boolean;
  } = {}
) => {
  const { threshold = 100, loading = false, hasMore = true } = options;

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (loading || !hasMore) return;
      
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        onLoadMore();
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, loading, hasMore, threshold]);
};
```

**Uso**:

```typescript
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  setLoading(true);
  const nextPage = page + 1;
  const data = await getPopularMovies(nextPage);
  
  setMovies(prev => [...prev, ...data.results]);
  setPage(nextPage);
  setHasMore(nextPage < data.total_pages);
  setLoading(false);
};

useInfiniteScroll(loadMore, { loading, hasMore, threshold: 200 });
```

### Debounce na Busca

```typescript
const [searchQuery, setSearchQuery] = useState('');
const debouncedSearch = useDebounce(searchQuery, 500);

useEffect(() => {
  if (debouncedSearch) {
    searchMovies(debouncedSearch);
  }
}, [debouncedSearch]);
```

### Lazy Loading de Imagens

```typescript
<img 
  src={getImageUrl(movie.poster_path)} 
  alt={movie.title}
  loading="lazy"
  className="w-full h-[400px] object-cover"
/>
```

### Memoização

```typescript
const movieGenreNames = useMemo(() => {
  return mapGenreIdsToNames(movie.genre_ids, genres);
}, [movie.genre_ids, genres]);

const cartTotal = useMemo(() => {
  return cart.reduce((sum, item) => sum + (item.movie.price * item.quantity), 0);
}, [cart]);
```

---

## 🔄 Fluxos da Aplicação

### Fluxo de Compra Completo

```
1. Usuário navega pelos filmes (Home)
   ├─> Busca filme (opcional)
   └─> Scroll infinito carrega mais filmes

2. Adiciona filme ao carrinho
   ├─> MovieCard → addToCart()
   ├─> CartContext atualiza estado
   ├─> localStorage persiste dados
   └─> Toast de confirmação

3. Adiciona aos favoritos (opcional)
   ├─> MovieCard → toggleFavorite()
   ├─> FavoritesContext atualiza
   └─> localStorage persiste

4. Abre o carrinho (CartSidebar)
   ├─> Visualiza itens
   ├─> Ajusta quantidades
   └─> Clica em "Finalizar Compra"

5. Checkout
   ├─> Preenche formulário
   ├─> Máscaras aplicadas automaticamente
   ├─> CEP busca endereço (ViaCEP)
   ├─> Validações em tempo real
   └─> Submete formulário

6. Sucesso
   ├─> SuccessModal exibido
   ├─> Número do pedido gerado
   ├─> Carrinho limpo
   └─> Redirect para Home
```

### Fluxo de Dados

```
Componente
    ↓
useContext Hook
    ↓
Context Provider
    ↓
State Update
    ↓
localStorage Sync
    ↓
Re-render
```

---

## 📋 Padrões de Código

### Nomenclatura

**Componentes**: PascalCase
```typescript
MovieCard.tsx
CartSidebar.tsx
```

**Hooks**: camelCase com prefixo `use`
```typescript
useCart()
useFavorites()
useInfiniteScroll()
```

**Funções utilitárias**: camelCase
```typescript
validateCPF()
maskPhone()
getImageUrl()
```

**Interfaces/Types**: PascalCase
```typescript
interface Movie { }
type CartItem = { }
```

**Constantes**: UPPER_SNAKE_CASE
```typescript
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = '...';
```

### Estrutura de Arquivos

**Componente com arquivo único**:
```
Component.tsx
```

**Componente com estilos e testes**:
```
Component/
├── Component.tsx
├── Component.module.css
└── Component.test.tsx
```

### Imports

Ordem recomendada:

```typescript
// 1. React e libs externas
import { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Componentes
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/MovieCard';

// 3. Hooks e contexts
import { useCart } from '@/context/CartContext';

// 4. Utils e services
import { validateCPF } from '@/utils/validators';
import { getPopularMovies } from '@/services/api';

// 5. Types
import type { Movie } from '@/services/api';

// 6. Estilos
import styles from './Component.module.css';
```

---

## 🔒 Segurança

### Variáveis de Ambiente

- ✅ API keys em variáveis de ambiente
- ✅ `.env` no `.gitignore`
- ✅ `.env.example` para template
- ❌ Nunca commitar `.env`

### Validação de Inputs

- ✅ Validação client-side (UX)
- ✅ Sanitização de dados
- ✅ TypeScript para type safety

### CORS

- ✅ TMDb API permite CORS
- ✅ ViaCEP permite CORS
- ✅ Requisições HTTPS

### XSS Prevention

- ✅ React escapa conteúdo automaticamente
- ✅ Uso de `dangerouslySetInnerHTML` evitado
- ✅ Validação de URLs de imagem

---

## 🚀 Deploy

### Build de Produção

```bash
# Gerar build otimizado
npm run build

# Preview local do build
npm run preview
```

**Output**: pasta `dist/` com arquivos estáticos

### Opções de Deploy

#### 1. **Vercel** (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

**Configuração** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_TMDB_API_KEY": "@tmdb_api_key"
  }
}
```

#### 2. **Netlify**

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy em produção
netlify deploy --prod
```

**Configuração** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3. **GitHub Pages**

```bash
# Adicionar em package.json
{
  "scripts": {
    "deploy": "vite build && gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

### Variáveis de Ambiente em Produção

**Vercel/Netlify Dashboard**:
1. Acessar configurações do projeto
2. Adicionar Environment Variables
3. `VITE_TMDB_API_KEY` = sua_chave
4. Rebuild da aplicação

---

## 📊 Métricas e Monitoramento

### Lighthouse Score (Meta)

- **Performance**: ≥ 90
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Bundle Size

```bash
# Analisar bundle
npm run build -- --stats

# Visualizar
npx vite-bundle-visualizer
```

### Cobertura de Testes

```bash
# Gerar relatório
npm run test:coverage

# Visualizar
open coverage/lcov-report/index.html
```

**Meta**: ≥ 80% de cobertura

---

## 🔄 Versionamento

### Semantic Versioning

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs

Exemplo: `1.2.3`

### Convenção de Commits

```
feat: adiciona novo componente X
fix: corrige bug no carrinho
docs: atualiza README
test: adiciona testes para validators
refactor: melhora performance do infinite scroll
style: formata código
chore: atualiza dependências
```

---

## 📞 Suporte e Manutenção

### Logs e Debug

**Development**:
```typescript
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```

**Production**:
- Usar serviços como Sentry para error tracking
- Implementar logging estruturado

### Atualizações de Dependências

```bash
# Verificar atualizações
npm outdated

# Atualizar patch versions
npm update

# Atualizar major versions (com cuidado)
npm install package@latest
```

---

## 🎓 Recursos Adicionais

### Documentações Oficiais

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [TMDb API](https://developers.themoviedb.org/3)

### Ferramentas Úteis

- [Can I Use](https://caniuse.com) - Compatibilidade de browsers
- [Bundlephobia](https://bundlephobia.com) - Tamanho de pacotes
- [TypeScript Playground](https://www.typescriptlang.org/play) - Testar TypeScript

---

**Última atualização**: 17 de outubro de 2025  
**Versão do projeto**: 1.0.0  
**Autor**: Ícaro Costa
