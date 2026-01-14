# operahh

Este projeto foi criado com [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), uma pilha moderna de TypeScript que combina Next.js, Fastify, ORPC e mais.

## Recursos

- **TypeScript** - Para segurança de tipo e experiência de desenvolvedor aprimorada
- **Next.js** - Framework React full-stack
- **TailwindCSS** - CSS orientado a utilitários para desenvolvimento rápido de UI
- **shadcn/ui** - Componentes de interface reutilizáveis
- **Fastify** - Framework web rápido e com baixa sobrecarga
- **oRPC** - APIs com tipagem segura de ponta a ponta com integração OpenAPI
- **Node.js** - Ambiente de execução
- **Prisma** - ORM orientado a TypeScript
- **PostgreSQL** - Motor de banco de dados
- **Autenticação** - Better-Auth
- **PWA** - Suporte a aplicativo web progressivo
- **Turborepo** - Sistema de compilação de monorepo otimizado

## Começando

Primeiro, instale as dependências:

```bash
npm install
```

## Configuração do Banco de Dados

Este projeto usa PostgreSQL com Prisma.

1. Certifique-se de ter um banco de dados PostgreSQL configurado (você pode usar o docker-compose.yml em `packages/db/` para iniciar uma instância local).
2. Configure as variáveis de ambiente necessárias:

   - Em `packages/db/.env`, defina as credenciais do banco de dados

   - Em `apps/server/.env`, defina a URL do banco de dados

3. Se você quiser usar o docker-compose para iniciar o banco de dados localmente, execute:
   ```bash
   cd packages/db
   npm run db:start
   ```

4. Aplique o esquema ao seu banco de dados:

```bash
npm run db:push
```

Então, execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3001](http://localhost:3001) no seu navegador para ver o aplicativo web.
A API está rodando em [http://localhost:3000](http://localhost:3000).

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
- `npm run db:push`: Enviar alterações de esquema para o banco de dados
- `npm run db:studio`: Abrir a interface do estúdio do banco de dados
- `cd apps/web && npm run generate-pwa-assets`: Gerar recursos do PWA
