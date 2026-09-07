# Workflow - Product Requirements Document (PRD)

> **Versão:** 1.0.0  
> **Data:** 19/07/2026  
> **Status:** Em Desenvolvimento  
> **Autor:** Dev

---

##  Índice

- [1. Visão Geral do Produto](#1-visão-geral-do-produto)
- [2. Objetivos Estratégicos](#2-objetivos-estratégicos)
- [3. Público-Alvo](#3-público-alvo)
- [4. Funcionalidades (Requisitos Funcionais)](#4-funcionalidades-requisitos-funcionais)
- [5. Requisitos Não-Funcionais](#5-requisitos-não-funcionais)
- [6. Fluxos da Aplicação](#6-fluxos-da-aplicação)
- [7. Critérios de Aceite](#7-critérios-de-aceite)
- [8. Roadmap de Entregas](#8-roadmap-de-entregas)
- [9. Glossário](#9-glossário)
- [10. Aprovações](#10-aprovações)

---

## 1. Visão Geral do Produto

### 1.1 O que é o Workflow?

O **Workflow** é uma aplicação de **workflow e gerenciamento de tarefas** inspirada no Monday.com, desenvolvida especificamente para o dia a dia de equipes de marketing digital.

### 1.2 Por que estamos construindo?

| Problema | Solução Workflow |
|----------|-----------------|
|  Custo alto do Monday.com | Redução de custo em ~70% |
|  Interface pesada e lenta | UI minimalista e rápida |
|  Dados sensíveis em servidores externos | Dados 100% próprios (LGPD) |
|  Ferramenta genérica | Feita sob medida para Marketing Digital |
|  Sem integração com nosso fluxo | Integrada com processos internos |

### 1.3 Valor Entregue

- **Para a Empresa:** Redução de custos, controle total dos dados
- **Para o Time:** Ferramenta ágil, focada no que importa
- **Para os Gestores:** Visibilidade completa das tarefas

---

## 2. Objetivos Estratégicos

### 2.1 Métricas de Sucesso (KPIs)

| KPI | Meta | Prazo |
|-----|------|-------|
| Redução de custo operacional | 70% comparado ao Monday | Mês 1 |
| Adoção do time | 100% dos colaboradores usando | Mês 2 |
| Tempo de resposta em tarefas | Redução de 50% | Mês 2 |
| Tarefas perdidas | Zero | Contínuo |
| Uptime da aplicação | 99.9% | Contínuo |

### 2.2 OKRs

| Objetivo | Key Result | Prazo |
|----------|-----------|-------|
| Lançar MVP funcional | 100% das features core rodando | Mês 1 |
| Adoção e engajamento | 15 usuários ativos diariamente | Mês 2 |
| Estabilidade | 99.9% de uptime | Mês 3 |
| Satisfação do time | NPS > 70 | Mês 3 |

---

## 3. Público-Alvo

### 3.1 Perfis de Usuário

| Perfil | Quantidade | Necessidades | Dores |
|--------|-----------|--------------|-------|
| **Gestor de Tráfego** | 4 pessoas | Visualizar campanhas, prazos, performance | Perder tarefas, falta de visibilidade |
| **Designers** | 3 pessoas | Receber briefings, anexar arquivos, aprovações | Briefings perdidos, retrabalho |
| **Redatores (Copy)** | 3 pessoas | Fluxo de revisão, prazos de entrega | Revisões desorganizadas |
| **Atendimento** | 3 pessoas | Acompanhar demandas dos clientes | Demandas esquecidas |
| **Diretoria** | 2 pessoas | Visão macro do time, relatórios | Falta de dados consolidados |

### 3.2 Jornada do Usuário (Exemplo: Criar Tarefa)
Acessa a aplicação
↓

Escolhe o Board
↓

Clica em "+ Adicionar"
↓

Preenche título, descrição, responsável, data
↓

Salva → Tarefa criada
↓

Tarefa aparece no Kanban
↓

Responsável recebe notificação


---

## 4. Funcionalidades (Requisitos Funcionais)

### EP01 - Autenticação e Usuários

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-01** | Como usuário, quero me cadastrar na plataforma | Alta | ✅ Concluído |
| **US-02** | Como usuário, quero fazer login com email e senha | Alta | ✅ Concluído |
| **US-03** | Como usuário, quero visualizar meu perfil | Média | ⏳ Pendente |
| **US-04** | Como usuário, quero editar meu perfil (nome, avatar) | Média | ⏳ Pendente |
| **US-05** | Como gestor, quero visualizar todos os usuários da empresa | Média | ⏳ Pendente |
| **US-06** | Como gestor, quero desativar/ativar usuários | Baixa | ⏳ Pendente |

**Especificação Técnica:**

- Autenticação via JWT (Bearer Token)
- Senhas hasheadas com bcrypt (salt 10)
- Token expira em 7 dias
- Roles: USER, MANAGER, ADMIN

---

### EP02 - Boards (Quadros)

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-07** | Como usuário, quero criar um novo Board | Alta | ✅ Concluído |
| **US-08** | Como usuário, quero listar todos os meus Boards | Alta | ✅ Concluído |
| **US-09** | Como usuário, quero visualizar um Board específico | Alta | ✅ Concluído |
| **US-10** | Como usuário, quero editar um Board (nome, cor) | Média | ⏳ Pendente |
| **US-11** | Como gestor, quero deletar um Board | Média | ⏳ Pendente |
| **US-12** | Como usuário, quero arquivar um Board | Baixa | ⏳ Pendente |

**Especificação Técnica:**

- Board tem: nome, descrição, cor, dono (owner)
- Cada Board tem 4 grupos padrão: "A Fazer", "Em Andamento", "Revisão", "Concluído"
- Boards são visíveis apenas para o dono e gestores

**Exemplo de Board:**
📋 Tráfego Pago
├── 🟣 Cor: #6C63FF
├── 👤 Dono: João (Gestor de Tráfego)
├── 📊 Status:
│ ├── 📌 A Fazer (3 tarefas)
│ ├── 🔄 Em Andamento (2 tarefas)
│ ├── 👀 Revisão (1 tarefa)
│ └── ✅ Concluído (5 tarefas)
└── 📅 Criado em: 19/07/2026


---

### EP03 - Grupos (Colunas do Kanban)

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-13** | Como usuário, quero visualizar os grupos de um Board | Alta | ✅ Concluído |
| **US-14** | Como gestor, quero criar um novo grupo | Média | ⏳ Pendente |
| **US-15** | Como gestor, quero editar um grupo (nome, cor) | Baixa | ⏳ Pendente |
| **US-16** | Como gestor, quero reordenar os grupos (drag-and-drop) | Baixa | ⏳ Pendente |
| **US-17** | Como gestor, quero deletar um grupo | Baixa | ⏳ Pendente |

**Especificação Técnica:**

- Grupos padrão: TODO, IN_PROGRESS, REVIEW, DONE
- Cada grupo tem: nome, posição (ordem), cor opcional
- Ao deletar um grupo, as tarefas são movidas para o grupo anterior

---

### EP04 - Itens (Tarefas/Cards)

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-18** | Como usuário, quero criar um novo item dentro de um grupo | Alta | ✅ Concluído |
| **US-19** | Como usuário, quero editar um item (título, descrição, etc) | Alta | ✅ Concluído |
| **US-20** | Como usuário, quero mover um item entre grupos (drag-and-drop) | Alta | ✅ Concluído |
| **US-21** | Como usuário, quero visualizar detalhes de um item | Alta | ✅ Concluído |
| **US-22** | Como usuário, quero excluir um item | Média | ⏳ Pendente |
| **US-23** | Como usuário, quero definir prioridade (Baixa, Média, Alta, Urgente) | Média | ⏳ Pendente |
| **US-24** | Como usuário, quero definir uma data de entrega | Média | ⏳ Pendente |
| **US-25** | Como usuário, quero atribuir um responsável | Alta | ✅ Concluído |
| **US-26** | Como usuário, quero adicionar tags/labels ao item | Baixa | ⏳ Pendente |

**Especificação Técnica:**

**Campos do Item:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| title | string | Sim | Título da tarefa |
| description | string | Não | Descrição detalhada |
| priority | enum | Não | LOW, MEDIUM, HIGH, URGENT |
| status | enum | Sim | TODO, IN_PROGRESS, REVIEW, DONE |
| assigneeId | UUID | Não | Responsável pela tarefa |
| dueDate | datetime | Não | Data de entrega |
| groupId | UUID | Sim | Grupo ao qual pertence |

**Movimentos Permitidos:**

| De | Para |
|----|------|
| TODO | IN_PROGRESS |
| IN_PROGRESS | REVIEW, TODO |
| REVIEW | DONE, IN_PROGRESS |
| DONE | (nenhum) |

---

### EP05 - Subtarefas

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-27** | Como usuário, quero adicionar subtarefas a um item | Média | ⏳ Pendente |
| **US-28** | Como usuário, quero marcar/desmarcar uma subtarefa como concluída | Média | ⏳ Pendente |
| **US-29** | Como usuário, quero editar uma subtarefa | Baixa | ⏳ Pendente |
| **US-30** | Como usuário, quero deletar uma subtarefa | Baixa | ⏳ Pendente |

**Especificação Técnica:**

- Subtarefa tem: título, status (completed: true/false)
- Subtarefa pertence a um único Item

---

### EP06 - Comentários

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-31** | Como usuário, quero comentar em um item | Alta | ✅ Concluído |
| **US-32** | Como usuário, quero visualizar todos os comentários de um item | Alta | ✅ Concluído |
| **US-33** | Como usuário, quero editar meu comentário | Média | ⏳ Pendente |
| **US-34** | Como usuário, quero deletar meu comentário | Média | ⏳ Pendente |
| **US-35** | Como usuário, quero marcar outro usuário (@menção) | Média | ⏳ Pendente |

**Especificação Técnica:**

- Comentário tem: conteúdo, autor, data de criação
- Suporte a @menções (notifica o usuário mencionado)

---

### EP07 - Anexos

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-36** | Como usuário, quero anexar arquivos a um item | Média | ⏳ Pendente |
| **US-37** | Como usuário, quero visualizar anexos de um item | Média | ⏳ Pendente |
| **US-38** | Como usuário, quero baixar um anexo | Média | ⏳ Pendente |
| **US-39** | Como usuário, quero deletar um anexo | Baixa | ⏳ Pendente |

**Especificação Técnica:**

- Formatos suportados: imagens (png, jpg, svg), PDF, Word, Excel
- Limite de 10MB por arquivo
- Máximo de 5 anexos por item

---

### EP08 - Notificações

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-40** | Como usuário, quero receber notificação quando for atribuído a uma tarefa | Alta | ✅ Concluído |
| **US-41** | Como usuário, quero receber notificação quando for mencionado em um comentário | Alta | ✅ Concluído |
| **US-42** | Como usuário, quero receber lembrete 1 dia antes do prazo | Média | ⏳ Pendente |
| **US-43** | Como usuário, quero visualizar minhas notificações | Média | ⏳ Pendente |
| **US-44** | Como usuário, quero marcar notificações como lidas | Média | ⏳ Pendente |

**Especificação Técnica:**

- Tipos de notificação: ASSIGNED, MENTIONED, DUE_SOON, OVERDUE
- Notificações em tempo real (WebSocket ou polling)
- Notificações por e-mail (opcional)

---

### EP09 - Visualizações

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-45** | Como usuário, quero visualizar o Board como Kanban (cards) | Alta | ✅ Concluído |
| **US-46** | Como usuário, quero visualizar o Board como Tabela/Lista | Média | ⏳ Pendente |
| **US-47** | Como usuário, quero visualizar itens em um Calendário | Média | ⏳ Pendente |
| **US-48** | Como usuário, quero filtrar itens por responsável, status, prioridade | Média | ⏳ Pendente |

**Especificação Técnica:**

- Kanban: Visualização padrão, arrastar cards
- Tabela: Visualização em grid, edição inline
- Calendário: Visualização mensal com itens agendados

---

### EP10 - Relatórios e Dashboard

| ID | História de Usuário | Prioridade | Status |
|----|-------------------|------------|--------|
| **US-49** | Como gestor, quero ver quantidade de tarefas por pessoa | Média | ⏳ Pendente |
| **US-50** | Como gestor, quero ver tarefas atrasadas em destaque | Média | ⏳ Pendente |
| **US-51** | Como gestor, quero ver tempo médio de conclusão | Baixa | ⏳ Pendente |
| **US-52** | Como gestor, quero exportar relatórios (CSV/Excel) | Baixa | ⏳ Pendente |

**Especificação Técnica:**

- Dashboard com cards de métricas principais
- Gráficos simples (Chart.js ou similar)

---

## 5. Requisitos Não-Funcionais

### 5.1 Performance

| Requisito | Meta |
|-----------|------|
| Tempo de carregamento da página | < 2 segundos |
| Tempo de resposta da API | < 200ms (p95) |
| Renderização do Kanban | < 500ms para 50 cards |
| Drag-and-drop | < 100ms de latência |
| Busca/filtro | < 300ms |

### 5.2 Disponibilidade

| Requisito | Meta |
|-----------|------|
| Uptime | 99.9% (máximo 8h de downtime/ano) |
| Manutenção programada | Fora do horário comercial |
| Recovery Time | < 15 minutos |

### 5.3 Segurança

| Requisito | Descrição |
|-----------|-----------|
| Autenticação | JWT com expiração em 7 dias |
| Senhas | Hash com bcrypt (salt 10) |
| HTTPS | Obrigatório em produção |
| Rate Limiting | 100 requisições/min por IP |
| Sanitização | Prevenção contra XSS e SQL Injection |
| CORS | Configurado apenas para domínios autorizados |

### 5.4 Escalabilidade

| Requisito | Meta |
|-----------|------|
| Usuários simultâneos | Suporte a 50 usuários concorrentes |
| Tarefas por Board | Suporte a 500+ tarefas |
| Boards por usuário | Suporte a 20+ boards |
| Database | Preparado para particionamento futuro |

### 5.5 Manutenibilidade

| Requisito | Descrição |
|-----------|-----------|
| Código | TypeScript, ESLint, Prettier |
| Testes | Cobertura mínima de 70% |
| Documentação | SDD, PRD, API Reference |
| Logs | Winston para logs estruturados |
| Monitoramento | Health checks, métricas básicas |

### 5.6 Usabilidade

| Requisito | Descrição |
|-----------|-----------|
| Design | Minimalista, cores da marca (Azul Neon provavelmente algo entre cyan) |
| Responsividade | Mobile-first, funciona em tablets e desktops |
| Acessibilidade | Contraste adequado, Modo escuro ( dark mode ) |
| Idiomas | Português (Brasil) |
| Feedback visual | Loading, toasts, confirmações |

---

## 6. Fluxos da Aplicação

### 6.1 Fluxo Principal: Criar e Gerenciar Tarefa


