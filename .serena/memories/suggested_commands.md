# Suggested Commands

**Development**
- `pnpm run dev`: Start all services in development mode (hot-reload).
- `pnpm run build`: Build all applications and packages.

**Quality Assurance**
- `pnpm run lint`: Run ESLint across the codebase.
- `pnpm run format`: Format code using Prettier.
- `pnpm run check-types`: Check TypeScript types without emitting files.

**Database (Per Service)**
Since `kysely-ctl` is used, migrations are typically run per service context or via a turbo task if configured.
- `pnpm run migrate`: Run database migrations (configured in root package.json to run via turbo).

**Infrastructure**
- `docker compose up -d`: Start infrastructure services (Postgres, RabbitMQ, Redis).

**Testing**
- Standard NestJS test commands should apply within apps (e.g., `test`, `test:e2e`), though specific global commands weren't explicitly seen in the root `package.json`, they are likely in individual `apps/*/package.json`.
