# operahh

Este projeto foi criado com [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), uma pilha moderna de TypeScript que combina Next.js, Fastify, oRPC e mais. Este README foca no onboarding local, incluindo preparo de ambiente, variaveis de ambiente e banco com Docker.

## Tecnologias

- **TypeScript** - Tipagem estatica e melhor DX
- **Next.js** - Frontend React full-stack
- **Fastify** - Backend HTTP rapido e leve
- **oRPC** - API tipada de ponta a ponta com suporte a OpenAPI
- **Tailwind CSS** - Estilizacao utilitaria
- **shadcn/ui** - Componentes de UI reutilizaveis
- **Prisma** - ORM e toolkit de banco
- **PostgreSQL** - Banco de dados relacional
- **Better Auth** - Autenticacao
- **Turborepo** - Monorepo com build otimizado
- **PWA** - Suporte a Progressive Web App

## Requisitos

- **Node.js** (recomendado 20+) e **npm** (o repo usa `npm@11.6.2`)
- **Docker Desktop** ou Docker Engine com Compose habilitado
- Git

## Onboarding local (passo a passo)

1. **Instale dependencias**
   ```bash
   npm install
   ```

2. **Configure variaveis de ambiente**
   - Copie os arquivos de exemplo:
     ```bash
     # Windows (CMD)
     copy apps\server\.env.example apps\server\.env
     copy packages\db\.env.example packages\db\.env
     ```
     ```bash
     # macOS/Linux
     cp apps/server/.env.example apps/server/.env
     cp packages/db/.env.example packages/db/.env
     ```
   - Ajuste as variaveis principais:
     - `packages/db/.env`: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
     - `apps/server/.env`: `DATABASE_URL` deve refletir as mesmas credenciais
     - `apps/web/.env`: confirme `NEXT_PUBLIC_SERVER_URL` (padrao `http://localhost:3000`)

3. **Suba o banco com Docker**
   ```bash
   npm run db:start
   ```

4. **Crie e aplique migrations do Prisma**
   ```bash
   npm run db:migrate
   ```

5. **Inicie o ambiente de desenvolvimento**
   ```bash
   npm run dev
   ```

6. **Acesse**
   - Web: `http://localhost:3001`
   - API: `http://localhost:3000`

## Seed do usuario admin (opcional)

Para criar o usuario inicial `admin@gmail.com` usando o fluxo do Better Auth:

1. Configure no `apps/server/.env`:
   - `ADMIN_SEED_PASSWORD` com a senha desejada
   - `BETTER_AUTH_URL` apontando para o servidor (ex: `http://localhost:3000`)

2. Suba o servidor (necessario para o seed):
   ```bash
   npm run dev:server
   ```

3. Execute o seed:
   ```bash
   npm run db:seed
   ```

## Estrutura do Projeto

```
operahh/
├── apps/
│   ├── web/         # Aplicação frontend (Next.js)
│   └── server/      # API backend (Fastify, ORPC)
├── packages/
│   ├── api/         # Camada de API / lógica de negócios
│   ├── auth/        # Configuração e lógica de autenticação
│   └── db/          # Esquema e consultas do banco de dados
```

## Scripts Disponíveis

- `npm run dev`: Iniciar todos os aplicativos em modo de desenvolvimento
- `npm run build`: Compilar todos os aplicativos
- `npm run dev:web`: Iniciar apenas o aplicativo web
- `npm run dev:server`: Iniciar apenas o servidor
- `npm run check-types`: Verificar tipos do TypeScript em todos os aplicativos
- `npm run db:migrate`: Criar e aplicar migrations no banco de dados
- `npm run db:push`: Aplicar schema diretamente (uso pontual/rapido)
- `npm run db:studio`: Abrir a interface do estúdio do banco de dados
- `cd apps/web && npm run generate-pwa-assets`: Gerar recursos do PWA
