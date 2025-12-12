# 🎮 ArcadeRank Web Client

Frontend moderno e performático para a plataforma de jogos **ArcadeRank**. Construído com foco em componentização, gerenciamento de estado global e renderização gráfica via Canvas API.

## 🚀 Tecnologias & Arquitetura

Este projeto utiliza uma stack atualizada focada em performance e DX (Developer Experience):

- **React + Vite**: Build tool ultrarrápido com Hot Module Replacement (HMR).
- **TypeScript**: Tipagem estrita para garantir contrato de dados com a API.
- **TailwindCSS**: Estilização Utility-First para UI consistente e responsiva.
- **Zustand**: Gerenciamento de estado global (Auth, User Session) minimalista e sem boilerplate.
- **Axios**: Cliente HTTP com padrão Singleton e Interceptors para injeção automática de JWT.
- **Canvas API**: Renderização de jogos (Snake) sem dependência de engines pesadas.
- **Lucide React**: Ícones leves e customizáveis.

## 🕹️ Funcionalidades

- [x] **Autenticação JWT**: Login seguro, persistência de sessão e proteção de rotas (Guards).
- [x] **Game Engines Customizadas**: Jogos (Snake, Clicker) implementados do zero usando `requestAnimationFrame` e React Refs para alta performance (60 FPS).
- [x] **Gamificação em Tempo Real**: HUD atualizado instantaneamente após o término das partidas.
- [x] **Ranking Visual**: Leaderboard com destaque para Top 3 e usuário logado.
- [x] **UI Responsiva**: Design "Dark Mode" adaptável para Desktop e Mobile.

## 📂 Estrutura do Projeto

```
src/
├── components/ # Componentes Reutilizáveis (ProtectedRoute, etc)
├── lib/ # Configurações de Infra (Axios instance)
├── pages/ # Telas da Aplicação (Login, Dashboard, Leaderboard)
│ └── games/ # Lógica Específica dos Jogos (Snake, Clicker)
├── store/ # Estado Global (Zustand Auth Store)
└── main.tsx # Entry Point
```

## 🔗 Integração

Este frontend consome a API RESTful do ArcadeRank Backend.
