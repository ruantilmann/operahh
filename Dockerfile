FROM node:22-bookworm AS build

WORKDIR /app

ARG DATABASE_URL=postgresql://user:pass@localhost:5432/db?schema=public
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ARG BETTER_AUTH_SECRET=local-dev-secret-please-change-32chars-min
ARG BETTER_AUTH_URL=http://localhost:3000
ARG CORS_ORIGIN=http://localhost:3001
ARG BETTER_AUTH_COOKIE_DOMAIN=example.com
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV CORS_ORIGIN=${CORS_ORIGIN}
ENV BETTER_AUTH_COOKIE_DOMAIN=${BETTER_AUTH_COOKIE_DOMAIN}

COPY package.json package-lock.json turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN printf "DATABASE_URL=%s\n" "$DATABASE_URL" > /app/apps/server/.env
RUN printf "NEXT_PUBLIC_SERVER_URL=%s\n" "$NEXT_PUBLIC_SERVER_URL" > /app/apps/web/.env
RUN printf "DATABASE_URL=%s\n" "$DATABASE_URL" >> /app/apps/web/.env
RUN printf "BETTER_AUTH_SECRET=%s\n" "$BETTER_AUTH_SECRET" >> /app/apps/web/.env
RUN printf "BETTER_AUTH_URL=%s\n" "$BETTER_AUTH_URL" >> /app/apps/web/.env
RUN printf "CORS_ORIGIN=%s\n" "$CORS_ORIGIN" >> /app/apps/web/.env
RUN printf "BETTER_AUTH_COOKIE_DOMAIN=%s\n" "$BETTER_AUTH_COOKIE_DOMAIN" >> /app/apps/web/.env

RUN npm ci
RUN npm run db:generate
RUN npm run build
RUN rm -rf /app/apps/web/.next/cache

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/apps ./apps
COPY --from=build /app/packages ./packages

RUN npm ci --omit=dev \
  && npm cache clean --force \
  && rm -f /app/apps/server/.env /app/apps/web/.env \
  && rm -rf /app/apps/web/.next/cache

EXPOSE 3000 3001

CMD ["sh", "-c", "PORT=3000 npm run -w server start & pid1=$!; PORT=3001 npm run -w web start & pid2=$!; wait $pid1 $pid2"]
