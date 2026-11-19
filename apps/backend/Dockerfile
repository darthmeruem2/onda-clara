FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/backend/package.json apps/backend/
RUN pnpm --filter @dtc/backend... install --frozen-lockfile
COPY apps/backend apps/backend
ARG MEDUSA_BACKEND_URL
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
RUN pnpm --filter @dtc/backend build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
RUN corepack enable
COPY --chown=node:node --from=build /app /app
USER node
ENV NODE_ENV=production
ENV PORT=9000
EXPOSE 9000
WORKDIR /app/apps/backend/.medusa/server
CMD ["node", "../../node_modules/@medusajs/cli/cli.js", "start"]
