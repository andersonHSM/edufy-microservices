# Code Style and Conventions

**General**
- **Language**: TypeScript (Strict mode enabled, ES2023 target).
- **Style Guide**: Prettier + ESLint (Standard NestJS rules + strict type checking).
- **Naming**: CamelCase for variables/functions, PascalCase for classes/interfaces.

**NestJS Patterns**
- **Modules**: Feature-based modularity.
- **Configuration**: Use `@nestjs/config` with typed configuration objects (in `src/libs/configuration`).
- **Microservices**: 
  - Use `Transport.TCP` for synchronous/internal calls.
  - Use `Transport.RMQ` for asynchronous events.
  - RabbitMQ setup includes Dead Letter Exchanges (DLX) for robustness.

**Database (Kysely)**
- **Migrations**: Stored in `src/libs/database/migrations`.
- **Dialect**: Postgres.
- **Naming**: Database columns usually snake_case, mapped to camelCase in code via `CamelCasePlugin`.

**Directories**
- `src/app/`: Core application domains/modules.
- `src/libs/`: Shared utilities, configs, and database setup per service.
