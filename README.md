# 🎬 Lojinha de Filmes

Um e-commerce completo de filmes que desenvolvi durante um processo seletivo para vaga de desenvolvedor front-end. O projeto simula uma loja virtual onde você pode navegar por milhares de filmes, adicionar aos favoritos, montar seu carrinho e finalizar a compra.

A ideia era criar uma experiência fluida e moderna, então apostei em tecnologias atuais e foquei bastante na UX - desde o infinite scroll para não precisar ficar clicando em "próxima página", até animações suaves que deixam a navegação mais agradável.

## ✅ Projeto Finalizado

Todas as funcionalidades foram implementadas e o projeto está pronto para uso!

## 🎯 O que aprendi nesse projeto

Esse foi um projeto bem desafiador e aprendi bastante coisa no caminho:

- **Integração com APIs externas**: Trabalhei com a API do TMDb (The Movie Database) para buscar os filmes e a ViaCEP para autocompletar endereços
- **Infinite Scroll**: Implementei carregamento progressivo de conteúdo, o que foi um desafio interessante de performance
- **Validações complexas**: Desde validar CPF com dígitos verificadores até aplicar máscaras em tempo real
- **State Management**: Usei Context API de forma estruturada, com persistência em localStorage
- **Componentização**: Separei tudo em componentes reutilizáveis seguindo as boas práticas do React
- **TypeScript**: Todo o código é tipado, o que ajudou muito a evitar bugs

## 🛠️ Stack Completa

### Core
- **React 19.1** - A base de tudo, com hooks e Context API
- **TypeScript** - Para deixar o código mais seguro e manutenível
- **Vite** - Build tool que é absurdamente rápida comparada ao webpack
- **React Router DOM** - Navegação entre páginas

### Estilização
- **Tailwind CSS** - Não costumo escrever CSS puro mais, o Tailwind agilizou demais
- **ShadCN UI** - Componentes prontos e acessíveis que customizei para o projeto
- **Radix UI** - Base dos componentes (Dialog, Sheet, Separator)
- **Lucide React** - Ícones modernos e leves
- **class-variance-authority (CVA)** - Gerenciar variantes de componentes ficou bem mais fácil

### Utilitários & Libs
- **Axios** - Para fazer as requisições HTTP
- **React Input Mask** - Máscaras nos campos do formulário (CPF, telefone, CEP)
- **clsx + tailwind-merge** - Unir classes CSS de forma condicional

### APIs Consumidas
- **TMDb API** - Base de dados com +1 milhão de filmes e séries
- **ViaCEP** - Busca de endereço por CEP

### Ferramentas de Dev
- **ESLint** - Manter o código padronizado
- **PostCSS + Autoprefixer** - Compatibilidade CSS entre browsers
- **Jest + React Testing Library** - Testes unitários e de integração
- **MSW (Mock Service Worker)** - Mockar APIs nos testes

## ✨ Funcionalidades

### 🎥 Catálogo de Filmes
- Listagem de filmes populares direto da base do TMDb
- **Infinite Scroll** - conforme você vai rolando, os filmes vão carregando automaticamente (bem melhor que ficar clicando em botão de "próxima página")
- Busca em tempo real com debounce de 500ms (para não fazer requisição a cada letra digitada)
- Cada filme mostra: poster, título, nota, gêneros e preço
- Skeleton loading enquanto carrega (aquele efeito de placeholder cinza)
- Preços fictícios gerados baseados na popularidade do filme

### 🛒 Carrinho de Compras
- Sidebar que desliza suavemente da direita (700ms de animação)
- Adicionar e remover filmes
- Aumentar/diminuir quantidade de cada item
- Cálculo automático do total
- Contador visual no header mostrando quantos itens tem
- Tudo salvo no localStorage (se fechar o navegador e abrir, seus itens ainda estarão lá)

### ❤️ Sistema de Favoritos
- Marcar filmes como favoritos (aquele coraçãozinho clássico)
- Sidebar exclusiva para ver seus favoritos
- Pode adicionar ao carrinho diretamente dos favoritos
- Contador no header
- Também persiste no localStorage

### 💳 Página de Checkout
- Formulário completo com todos os campos necessários
- Máscaras automáticas em CPF, telefone e CEP (digita e já formata bonitinho)
- Validação de CPF real (com dígitos verificadores e tudo)
- Busca automática de endereço quando você digita o CEP (integração com ViaCEP)
- Resumo do pedido mostrando todos os itens e total
- Modal de sucesso super bacana quando finaliza a compra

### 📱 Responsividade
- Funciona perfeitamente em celular, tablet e desktop
- Header se adapta conforme o tamanho da tela:
  - **Mobile**: Logo e botões na primeira linha, busca na segunda
  - **Desktop**: Logo à esquerda, busca no centro, botões à direita
- Grid de filmes vai de 1 coluna (mobile) até 4 colunas (desktop grande)
- Testei em vários tamanhos de tela para garantir que ficou bom

## ⚙️ Como rodar o projeto

### Você vai precisar de:

- Node.js versão 18 ou superior
- npm (geralmente já vem com o Node)
- Uma conta gratuita no TMDb para pegar a API Key

### Passo a passo:

**1. Clone o repositório**
```bash
git clone https://github.com/icastelito/lojinha-de-filmes.git
cd lojinha-de-filmes
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**

Tem um arquivo `.env.example` no projeto. Copie ele e renomeie para `.env`:
```bash
cp .env.example .env
```

**4. Pegue sua API Key do TMDb**

É rapidinho:
- Cria uma conta em: https://www.themoviedb.org/signup
- Depois vai em: https://www.themoviedb.org/settings/api
- Solicita uma API Key (escolhe a opção "Developer")
- Copia a chave que aparece (é a v3)

**5. Cole a API Key no arquivo .env**

Abre o `.env` e cola sua chave:
```env
VITE_TMDB_API_KEY=sua_chave_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**6. Roda o projeto**
```bash
npm run dev
```

**7. Abre no navegador**
```
http://localhost:5173
```

Pronto! Se tudo deu certo, você já tá vendo a lojinha rodando 🎉

## 🧪 Testes

Implementei testes para as partes mais críticas do projeto:

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch (útil durante desenvolvimento)
npm run test:watch

# Ver cobertura de testes
npm run test:coverage
```

Os testes cobrem:
- Validações de formulário (CPF, email, CEP, telefone)
- Máscaras de formatação
- Context de carrinho e favoritos
- Componentes principais
- Integração com as APIs (usando MSW para mockar)

## 📁 Estrutura do Projeto

```
lojinha-de-filmes/
├── public/                  # Arquivos estáticos
├── src/
│   ├── components/          # Todos os componentes React
│   │   ├── ui/             # Componentes do ShadCN (button, card, dialog, etc)
│   │   ├── Header/         # Cabeçalho da aplicação
│   │   ├── SearchBar/      # Barra de busca
│   │   ├── MovieCard/      # Card de cada filme
│   │   ├── MovieGrid/      # Grid responsivo
│   │   ├── Cart/           # Sidebar do carrinho
│   │   ├── Favorites/      # Sidebar de favoritos
│   │   └── SuccessModal/   # Modal de confirmação
│   ├── context/            # Context API
│   │   ├── CartContext.tsx
│   │   └── FavoritesContext.tsx
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home/
│   │   └── CheckoutPage/
│   ├── services/           # Integrações com APIs
│   │   ├── api.ts         # TMDb API
│   │   └── viaCep.ts      # ViaCEP API
│   ├── utils/              # Funções auxiliares
│   │   ├── validators.ts   # Validações (CPF, email, etc)
│   │   └── masks.ts       # Máscaras de formatação
│   ├── hooks/              # Hooks customizados
│   │   └── useInfiniteScroll.ts
│   ├── mocks/              # Mocks para testes
│   │   ├── handlers.ts
│   │   └── server.ts
│   └── lib/                # Utilitários do Tailwind
├── .env                    # Variáveis de ambiente (não sobe pro git)
├── .env.example           # Exemplo de configuração
├── package.json
└── README.md
```

## 🐛 Problemas Comuns

**"API Key inválida" ou filmes não carregam**
- Confere se você copiou a chave certinha no `.env`
- Tem que ser a API Key v3, não a v4
- Salva o arquivo e reinicia o servidor (`Ctrl+C` e `npm run dev` de novo)

**"Cannot find module" ou erro de dependências**
- Roda `npm install` novamente
- Se persistir, apaga a pasta `node_modules` e o `package-lock.json`, depois `npm install` denovo

**Página em branco ou não abre**
- Verifica se a porta 5173 já não tá sendo usada por outro processo
- Olha o console do terminal, geralmente tem uma mensagem de erro útil
- Tenta acessar com `http://127.0.0.1:5173` ao invés de `localhost`

## � Reflexões sobre o projeto

Foi um desafio bem legal de fazer. Inicialmente achei que seria mais simples, mas conforme fui implementando, percebi a quantidade de detalhes que fazem diferença: debounce na busca para não sobrecarregar a API, skeleton loading para melhorar a percepção de velocidade, persistência no localStorage para não perder dados ao recarregar...

O infinite scroll foi particularmente interessante - tive que me preocupar com performance, evitar requisições duplicadas e ainda manter a experiência fluida. No final, ficou bem satisfatório.

Também foi minha primeira vez usando ShadCN UI de forma mais profunda. A liberdade de ter os componentes no próprio projeto (em vez de um node_module) é ótima para customizar, mas exige um pouco mais de organização.

Se fosse fazer de novo, talvez consideraria usar React Query para gerenciar o cache das requisições - acabei fazendo um controle manual que funciona, mas poderia ser mais elegante.

## 📝 Scripts disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
npm run lint         # Roda o linter
npm test             # Roda os testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Relatório de cobertura
```

## 👨‍💻 Sobre

Projeto desenvolvido como teste técnico para vaga de desenvolvedor front-end, mas acabou virando um bom estudo de caso de como estruturar uma aplicação React moderna.

Todas as funcionalidades propostas foram implementadas e ainda adicionei algumas extras (como o infinite scroll e os testes automatizados).

---

**Desenvolvido por:** Ícaro Costa  
**Data:** Outubro de 2025  
**Status:** ✅ Finalizado  
**Contexto:** Teste técnico + Projeto de estudos

