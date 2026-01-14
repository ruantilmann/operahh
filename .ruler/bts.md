# Regras do Projeto Better-T-Stack

Este é um projeto operahh criado com a CLI Better-T-Stack.

## Estrutura do Projeto

Este é um monorepo com a seguinte estrutura:

- **`apps/web/`** - Aplicação frontend (Next.js)

- **`apps/server/`** - Servidor backend (Fastify)

- **`packages/api/`** - Lógica e tipos de API compartilhados
- **`packages/auth/`** - Lógica e utilitários de autenticação
- **`packages/db/`** - Esquema e utilitários de banco de dados
- **`packages/env/`** - Variáveis de ambiente e validação compartilhadas
- **`packages/config/`** - Configuração compartilhada do TypeScript

## Scripts Disponíveis

- `npm run dev` - Iniciar todos os aplicativos em modo de desenvolvimento
- `npm run dev:web` - Iniciar apenas o aplicativo web
- `npm run dev:server` - Iniciar apenas o servidor
- `npm run build` - Compilar todos os aplicativos
- `npm run lint` - Verificar lint em todos os pacotes
- `npm run typecheck` - Verificar tipos do TypeScript em todos os pacotes

## Comandos de Banco de Dados

Todas as operações de banco de dados devem ser executadas a partir do workspace do servidor:

- `npm run db:push` - Enviar alterações de esquema para o banco de dados
- `npm run db:studio` - Abrir o estúdio do banco de dados
- `npm run db:generate` - Gerar arquivos do Prisma
- `npm run db:migrate` - Executar migrações do banco de dados

O esquema do banco de dados está localizado em `packages/db/prisma/schema.prisma`

## Estrutura da API

- Contratos e roteadores oRPC estão em `packages/api/src/`
- Cliente oRPC do lado do cliente está em `apps/web/src/utils/orpc.ts`

## Autenticação

A autenticação é fornecida pelo Better Auth:

- A configuração de autenticação está em `packages/auth/src/`
- Cliente de autenticação do aplicativo web está em `apps/web/src/lib/auth-client.ts`

## Configuração do Projeto

Este projeto inclui um arquivo de configuração `bts.jsonc` que armazena suas configurações do Better-T-Stack:

- Contém sua configuração de pilha selecionada (banco de dados, ORM, backend, frontend, etc.)
- Usado pela CLI para entender a estrutura do seu projeto
- Seguro para excluir se não for necessário

## Pontos Principais

- Este é um monorepo Turborepo usando workspaces do npm
- Cada aplicativo tem seu próprio `package.json` e dependências
- Execute comandos a partir da raiz para executar em todos os workspaces
- Execute comandos específicos do workspace com `npm run nome-do-comando`
- Turborepo lida com cache de compilação e execução paralela

## Idioma de Comunicação

- Todas as respostas e documentação devem ser fornecidas em **Português Brasileiro**
- Mantenha termos técnicos em inglês quando apropriado, mas forneça traduções ou explicações quando necessário
- Siga as convenções ortográficas e gramaticais do português brasileiro

## Criação de Endpoints

- Os endpoints devem ser organizados em módulos dentro de `packages/api/src/routers/`
- Cada módulo deve ter seu próprio arquivo (ex: `users.ts`, `posts.ts`, etc.)
- Use `publicProcedure` para endpoints que não exigem autenticação
- Use `protectedProcedure` para endpoints que exigem autenticação
- Sempre utilize Zod para validar entradas e saídas dos endpoints
- Siga o padrão estabelecido no módulo de usuários (`users.ts`) como exemplo
- Adicione o novo módulo ao roteador principal em `packages/api/src/routers/index.ts`
- Consulte o guia detalhado em `.ruler/backend/createEndpoints.md` para mais informações
