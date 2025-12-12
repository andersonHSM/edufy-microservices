FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build --filter=enrollments-api

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/enrollments-api/dist /app/apps/enrollments-api/dist
COPY --from=builder /app/apps/enrollments-api/package.json /app/apps/enrollments-api/package.json

WORKDIR /app/apps/enrollments-api
CMD ["node", "dist/main"]
