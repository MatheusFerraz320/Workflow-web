 ## System design 
 - Layered Architecture 

 
 ## Version 1 
 
                         REQUISIÇÃO HTTP (Entrada)
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CAMADA DE APRESENTAÇÃO                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Controller                                               │ │
│  │                                                          │ │
│  │  @UseGuards(JwtAuthGuard, RolesGuard)  ← AQUI! 🛡️      │ │
│  │  @Roles(Role.ADMIN)                   ← AQUI! 🛡️      │ │
│  │                                                          │ │
│  │  - Recebe a requisição HTTP                              │ │
│  │  - Valida os dados de entrada (DTO + class-validator)   │ │
│  │  - Chama o Service                                       │ │
│  │  - Retorna a resposta formatada (DTO de saída)          │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CAMADA DE APLICAÇÃO                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Service                                                  │ │
│  │  - Aplica REGRAS DE NEGÓCIO                              │ │
│  │  - Orquestra a execução                                  │ │
│  │  - Valida permissões específicas (ex: só dono pode)      │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CAMADA DE PERSISTÊNCIA                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Prisma ORM                                              │ │
│  │  - Executa QUERIES no banco de dados                    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                         BANCO DE DADOS
                      (PostgreSQL / Prisma)