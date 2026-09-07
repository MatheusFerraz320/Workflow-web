# Workflow

Workflow é uma aplicação web para gerenciar o trabalho do dia a dia em quadros (boards), inspirada no Monday.com. Boards, itens, prioridades, prazos, responsáveis, comentários e métricas em uma interface limpa, com modo claro/escuro.

## Propósito

A ferramenta centraliza o acompanhamento de projetos e tarefas de uma equipe: cada board reúne itens organizados em colunas por status (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`), com prioridade, responsável e prazo. Itens podem ter descrição rica, comentários e serem fixados (pin) para acesso rápido na tela **My Work**. Tarefas atribuídas ao usuário logado aparecem automaticamente em **My Work**, e a tela **Métricas** traz um panorama da operação com gráficos.

O frontend depende de uma API própria (`workFlow-api`) para persistência e autenticação. A sessão usa JWT — o token fica no `localStorage` e é enviado no header `Authorization: Bearer <token>` em todas as requisições. Há três papéis de usuário: `USER`, `MANAGER` e `ADMIN`; telas administrativas (usuários e cadastro) exigem `ADMIN`.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Vite 8 + React 19 + TypeScript |
| Estilo | Tailwind CSS v4 (tokens de cor `brand-*`, via `@tailwindcss/vite`) |
| Rotas | React Router 7 (rotas protegidas) |
| Estado | Zustand 5 |
| Editor de texto rico | TipTap 3 |
| Gráficos | Recharts |
| Toasts | Sonner |
| Ícones | lucide-react |

## Telas e rotas

| Tela | Rota | Descrição |
| --- | --- | --- |
| Login | `/login` | Autenticação (`POST /auth/login`) e controle de tema |
| Home | `/` | Boards do usuário: criar, editar e arquivar |
| Board | `/boards/:id` | Quadro em colunas por status; criar e editar itens |
| Detalhe do item | `/boards/:boardId/items/:itemId` | Descrição rica, comentários e pin |
| Editar item | `/boards/:boardId/items/:itemId/edit` | Edição de título, descrição, prioridade, status, responsável e prazo |
| My Work | `/my-work` | Itens atribuídos e fixados, com filtros (todos / atribuídos / fixados) |
| Métricas | `/metrics` | Resumo geral, itens por status/prioridade, top boards e entregas próximas |
| Usuários (Admin) | `/users` | Listar e editar usuários (nome, e-mail, papel, ativo) |
| Cadastro (Admin) | `/register` | Criar usuários |
| Perfil | `/profile` | Dados e senha do usuário autenticado |

A autenticação protege todas as rotas; `AuthGuard` redireciona para `/login` quando não há sessão. O painel principal (`Layout`) inclui navbar (busca, atalhos, tema, sino), sidebar colapsável com a lista de boards e o avatar do usuário.

## Estado e integração

Toda comunicação é feita com `fetch` apontando para `VITE_API_URL`, enviando `Authorization: Bearer <token>` em requisições autenticadas.

| Store | Endpoints |
| --- | --- |
| `authStore` | `POST /auth/login`, `GET /users/me`, `PATCH /users/me` |
| `boardStore` | `GET /boards`, `POST /boards/create`, `GET /boards/:id`, `PATCH /boards/:id` |
| `itemStore` | `GET /items/board/:boardId`, `GET /items/:id`, `POST /items/create`, `PATCH /items/:id`, `DELETE /items/:id`, `POST /comments/create`, `DELETE /comments/:id` |
| `userStore` | `GET /users`, `GET /users/:id`, `PATCH /users/:id` |
| `myWorkStore` | `GET /users/me/assigned-items` |
| Métricas | `GET /metrics/summary`, `GET /metrics/by-status`, `GET /metrics/by-priority`, `GET /metrics/top-boards`, `GET /metrics/upcoming-deliveries` |

> **Nota:** o pin (fixação) de itens ainda é local, persistido no `localStorage` (`workflow:pinnedItems`). Os endpoints `POST/DELETE /items/:id/pin` e `GET /items/pinned` estão previstos, mas o backend ainda não os implementa (ver `src/stores/myWorkStore.ts`).

## Rodando o projeto

Pré-requisitos: Node 20+ e a API `workFlow-api` em execução.

```bash
npm install
cp .env.example .env
npm run dev
```

### Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `VITE_API_URL` | Sim | `http://localhost:3000` | URL base da API (auth, boards, itens, métricas) |

### Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Typecheck (`tsc -b`) e build de produção |
| `npm run lint` | Lint com oxlint |
| `npm run preview` | Prévia do build de produção |

## Documentação

- `docs/PRD.md` — Product Requirements Document (visão, público, requisitos funcionais e não funcionais, KPIs/OKRs e fluxos)
- `docs/SDD.md` — Software Design Document (arquitetura e design)
- `docs/techSpec.md` — Especificação técnica

## Melhorias futuras

- **Drag-and-drop** para mover/reordenar itens entre colunas e no board (o PRD lista como implementado, mas não está)
- **Notificações** — o sino na navbar é decorativo; o PRD prevê EP08 com notificações reais
- **Subtarefas e anexos** (EP05 e EP07 do PRD) — ainda não implementados
- **Visualizações** (EP09): timeline, calendário e por responsável
- **Pin persistido no backend**, para que "fixados" seja compartilhado em qualquer dispositivo
- **Busca global funcional** — o campo no navbar hoje é decorativo
- **Limpeza de código morto** — `WorkColumn` e `EditItemModal` não são usados
- **Testes automatizados e CI** — o projeto não possui testes nem pipeline
- **Proxy do Vite** para a API em desenvolvimento (evita CORS) e plugin `@tailwindcss/typography` para estilizar as descrições ricas (`prose`)

## English

Workflow is a web application for managing team tasks on boards, inspired by Monday.com. It is built with **Vite 8, React 19, TypeScript and Tailwind CSS v4**, using **Zustand** for state, **React Router 7** for protected routes, **TipTap** for rich-text descriptions, **Recharts** for metrics charts and **Sonner** for toasts.

Boards (`/boards/:id`) group items into status columns (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`). Each item has a priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), an assignee, a due date and comments. The **My Work** screen lists items assigned to the logged-in user plus locally-pinned items (pin data is stored in `localStorage` for now). The **Metrics** screen summarizes boards, status and priorities through API endpoints. Authentication is JWT-based against the `workFlow-api` backend; `VITE_API_URL` configures the API base URL.

All routes live behind an auth guard, and user management (`/users`) plus user registration (`/register`) require the `ADMIN` role. There are no automated tests yet, and drag-and-drop, notifications, sub-tasks, attachments and alternate views are planned but not implemented.