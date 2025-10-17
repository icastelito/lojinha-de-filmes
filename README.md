# 🎬 Lojinha de Filmes

E-commerce de filmes desenvolvido com React + TypeScript + Vite + Tailwind CSS + ShadCN UI para o teste técnico da DOT Digital Group.

## 🚀 Status do Projeto

**Fase Atual:** FASE 8 - POLIMENTO ✅

### ✅ Concluído
- [x] FASE 1: Configuração Inicial
- [x] FASE 2: Integração com API TMDb
  - [x] Serviço de API configurado
  - [x] Endpoints implementados (popular, search, details)
  - [x] Serviço ViaCEP implementado
  - [x] Helpers (getImageUrl, generatePrice)
- [x] FASE 3: Desenvolvimento da Página Inicial
  - [x] Header com logo e contador do carrinho
  - [x] Barra de pesquisa com debounce
  - [x] Grid responsivo de filmes
  - [x] MovieCard com botões de adicionar ao carrinho e favoritar
  - [x] Loading states
  - [x] Context API (Cart e Favorites)
  - [x] Persistência no localStorage
  - [x] **Infinite Scroll com Lazy Loading** 🆕
- [x] FASE 4: Carrinho Lateral
  - [x] Sidebar animada (Radix UI Sheet)
  - [x] Adicionar/remover itens
  - [x] Controle de quantidade
  - [x] Cálculo automático de subtotal e total
  - [x] Animações suaves (700ms)
- [x] FASE 5: Sistema de Favoritos
  - [x] Context API para favoritos
  - [x] Sidebar de favoritos
  - [x] Adicionar ao carrinho diretamente dos favoritos
  - [x] Persistência no localStorage
- [x] FASE 6: Checkout
  - [x] Formulário completo
  - [x] Validações (email, CPF, CEP, telefone, nome)
  - [x] Máscaras de formatação
  - [x] Integração ViaCEP automática
  - [x] Resumo do pedido
- [x] FASE 7: Modal de Sucesso
  - [x] Dialog animado
  - [x] Confirmação de pedido
  - [x] Limpeza do carrinho
- [x] FASE 8: Polimento
  - [x] Responsividade completa (mobile-first)
  - [x] Header adaptativo
  - [x] Infinite Scroll implementado
  - [x] Animações e transições

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool moderna e rápida

### Estilização
- **Tailwind CSS** - Framework CSS utility-first
- **ShadCN UI** - Componentes reutilizáveis
- **Radix UI** - Componentes acessíveis (Dialog, Sheet, Separator)
- **tailwindcss-animate** - Animações suaves
- **Lucide React** - Biblioteca de ícones

### State Management
- **Context API** - Gerenciamento de estado global
- **localStorage** - Persistência de dados

### APIs e HTTP
- **Axios** - Cliente HTTP
- **TMDb API** - Base de dados de filmes
- **ViaCEP API** - Consulta de CEP

### Navegação
- **React Router DOM** - Roteamento client-side

### Utilitários
- **class-variance-authority (CVA)** - Gerenciamento de variantes de componentes
- **clsx** - Utilitário para classes condicionais

## ✨ Funcionalidades Principais

### 🎥 Catálogo de Filmes
- ✅ Listagem de filmes populares do TMDb
- ✅ **Infinite Scroll** - Carregamento automático ao rolar a página
- ✅ **Lazy Loading** - Otimização de performance
- ✅ Busca em tempo real com debounce (500ms)
- ✅ Exibição de gêneros
- ✅ Preços fictícios baseados em popularidade
- ✅ Loading states e tratamento de erros

### 🛒 Carrinho de Compras
- ✅ Sidebar animada que desliza da direita (700ms)
- ✅ Adicionar/remover filmes
- ✅ Controle de quantidade por item
- ✅ Cálculo automático de subtotal e total
- ✅ Contador visual no header
- ✅ Persistência entre sessões (localStorage)

### ❤️ Sistema de Favoritos
- ✅ Adicionar/remover favoritos
- ✅ Sidebar dedicada para favoritos
- ✅ Adicionar ao carrinho diretamente dos favoritos
- ✅ Indicador visual nos cards
- ✅ Contador no header
- ✅ Persistência no localStorage

### 💳 Checkout
- ✅ Formulário completo com validações
- ✅ Máscaras automáticas (CPF, telefone, CEP)
- ✅ Busca automática de endereço por CEP (ViaCEP)
- ✅ Validação de CPF com dígitos verificadores
- ✅ Resumo do pedido em tempo real
- ✅ Modal de confirmação animado

### 📱 Responsividade
- ✅ Layout mobile-first
- ✅ Header adaptativo:
  - **Mobile:** Logo + botões (linha 1), Busca (linha 2)
  - **Desktop:** Logo (esquerda), Busca (centro), Botões (direita)
- ✅ Grid responsivo (1 a 4 colunas)
- ✅ Testes em múltiplos dispositivos

## ⚙️ Configuração e Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no TMDb para obter API Key

### Passo a Passo

1. **Clone o repositório**
```bash
git clone [URL_DO_REPOSITORIO]
cd lojinha-de-filmes
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

4. **Obtenha sua API Key do TMDb**

   a. Acesse: https://www.themoviedb.org/signup
   
   b. Crie uma conta gratuita
   
   c. Vá em: https://www.themoviedb.org/settings/api
   
   d. Solicite uma API Key (escolha a opção "Developer")
   
   e. Copie a API Key (v3 auth)

5. **Configure a API Key no arquivo .env**

Abra o arquivo `.env` e cole sua API Key:
```env
VITE_TMDB_API_KEY=sua_chave_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

6. **Execute o projeto**
```bash
npm run dev
```

7. **Acesse no navegador**
```
http://localhost:5173
```

## 🧪 Testando a Integração API

Após configurar a API Key e rodar o projeto, você verá uma página de testes que valida:

- ✅ Busca de filmes populares
- ✅ Busca por termo de pesquisa
- ✅ Detalhes de filmes específicos
- ✅ Carregamento de imagens
- ✅ Geração de preços fictícios
- ✅ Tratamento de erros

## 📁 Estrutura do Projeto

```
lojinha-de-filmes/
├── public/
├── src/
│   ├── components/
│   │   ├── ApiTest.tsx          # Componente de teste da API
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchBar.module.css
│   │   ├── MovieCard/
│   │   │   ├── MovieCard.tsx
│   │   │   └── MovieCard.module.css
│   │   ├── MovieGrid/
│   │   │   ├── MovieGrid.tsx
│   │   │   └── MovieGrid.module.css
│   │   └── Loading/
│   │       ├── Loading.tsx
│   │       └── Loading.module.css
│   ├── context/
│   │   ├── CartContext.tsx      # Gerenciamento do carrinho
│   │   └── FavoritesContext.tsx # Gerenciamento de favoritos
│   ├── pages/
│   │   └── Home/
│   │       ├── Home.tsx
│   │       └── Home.module.css
│   ├── services/
│   │   ├── api.ts               # Serviço TMDb API (TypeScript)
│   │   └── viaCep.ts            # Serviço ViaCEP (TypeScript)
│   ├── App.tsx
│   ├── main.tsx
│   ├── App.css
│   └── index.css
├── .env                          # Variáveis de ambiente (não versionado)
├── .env.example                 # Exemplo de variáveis
├── package.json
└── README.md
```

## 🎯 Funcionalidades Implementadas

### Fase 2 - API TMDb

**Endpoints disponíveis:**

1. `getPopularMovies(page)` - Busca filmes populares
2. `searchMovies(query, page)` - Busca filmes por termo
3. `getMovieDetails(movieId)` - Obtém detalhes de um filme
4. `getMovieGenres()` - Lista de gêneros de filmes

**Helpers:**

- `getImageUrl(path, size)` - Gera URL de imagens do TMDb
- `generatePrice(popularity)` - Gera preço fictício baseado na popularidade

### Fase 3 - Página Inicial

**Componentes:**

- ✅ **Header** - Logo e botão do carrinho com contador de itens
- ✅ **SearchBar** - Busca com debounce (500ms)
- ✅ **MovieCard** - Card de filme com:
  - Poster do filme
  - Título e ano
  - Avaliação (estrelas)
  - Preço fictício
  - Botão adicionar ao carrinho
  - Botão de favoritar (coração)
- ✅ **MovieGrid** - Grid responsivo de filmes
- ✅ **Loading** - Estado de carregamento animado

**Context API:**

- ✅ **CartContext** - Gerenciamento do carrinho
  - Adicionar item
  - Remover item
  - Atualizar quantidade
  - Calcular total
  - Persistência no localStorage
- ✅ **FavoritesContext** - Gerenciamento de favoritos
  - Adicionar/remover favorito
  - Verificar se é favorito
  - Persistência no localStorage

**Funcionalidades:**

- ✅ Listagem de filmes populares
- ✅ Busca de filmes em tempo real
- ✅ Sistema de favoritos
- ✅ Adicionar filmes ao carrinho
- ✅ Contador de itens no carrinho
- ✅ Responsividade completa (mobile, tablet, desktop)
- ✅ Animações suaves
- ✅ Loading states
- ✅ Tratamento de erros

### Serviço ViaCEP

**Funções disponíveis:**

- `buscarCEP(cep)` - Busca endereço por CEP

## 🐛 Troubleshooting

### Erro: "API Key inválida"
- Verifique se copiou a API Key corretamente no arquivo `.env`
- Certifique-se de que está usando a API Key v3 (não v4)
- Reinicie o servidor de desenvolvimento após alterar o `.env`

### Erro: "CORS"
- Não deve ocorrer pois a API TMDb permite CORS
- Se ocorrer, verifique se a URL base está correta

### Erro: "Cannot find module"
- Execute `npm install` novamente
- Verifique se o Node.js está atualizado

## 📝 Próximas Etapas

- [ ] Fase 4: Carrinho Lateral
  - [ ] Sidebar que abre/fecha
  - [ ] Lista de itens
  - [ ] Alterar quantidade
  - [ ] Remover itens
  - [ ] Cálculo de totais
  - [ ] Botão finalizar compra
  - [ ] Animações slide
- [ ] Fase 5: Sistema de Favoritos (já implementado parcialmente)
- [ ] Fase 6: Checkout
- [ ] Fase 7: Modal de Sucesso
- [ ] Fase 8: Polimento e Deploy

## 👨‍💻 Desenvolvimento

Desenvolvido como parte do teste técnico para a vaga de Desenvolvedor Front-end na DOT Digital Group.

---

**Data:** 16 de outubro de 2025  
**Status:** Em Desenvolvimento 🚧


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
