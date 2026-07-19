# Build from the REPO ROOT (pnpm workspace needs the root lockfile):
#   docker build -f apps/api/Dockerfile -t scout-api .
# railway.json / render.yaml in the repo root are already set up this way.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

FROM base AS build
RUN pnpm install --frozen-lockfile --filter @scout/api
COPY apps/api apps/api
RUN pnpm --filter @scout/api build

FROM base AS prod-deps
RUN pnpm install --frozen-lockfile --filter @scout/api --prod

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/package.json
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/main.js"]
