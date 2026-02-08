FROM node:22-bookworm AS build

WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm ci
RUN npm run db:generate
RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps ./apps
COPY --from=build /app/packages ./packages

EXPOSE 3000 3001

CMD ["sh", "-c", "PORT=3000 npm run -w server start & PORT=3001 npm run -w web start & wait -n"]
