# Dockerization Plan: Edufy Microservices

## Objective

Dockerize the entire Edufy microservices ecosystem to enable a consistent development and deployment environment. This involves creating optimized Dockerfiles for each application and a comprehensive `docker-compose.yml` to orchestrate services, databases, and message brokers.

## Current Status

- **Infrastructure:** `docker-compose.yml` already exists and correctly sets up:
  - Postgres databases for `auth`, `users`, `courses`, `enrollments`, `support`.
  - Redis.
  - RabbitMQ.
  - pgAdmin.
- **Applications:** No Docker configuration currently exists for the application services (`api-gateway`, `auth-api`, etc.).

## Task Plan

### 1. Create Dockerfiles for Each Service

Create a multi-stage `Dockerfile` in the root of each application (`apps/*/Dockerfile`).
The build process should leverage `turbo` for efficient monorepo builds, but since we want isolated containers, we will assume a standard NestJS build process for now or use `turbo prune` if we were doing a highly optimized root-level build context.

**Strategy:** Use a consistent `Dockerfile` template for all NestJS apps.

**Target Apps:**
- `apps/api-gateway`
- `apps/auth-api`
- `apps/users-api`
- `apps/courses-api`
- `apps/enrollments-api`
- `apps/support-api`

**Template Structure:**
1.  **Base:** `node:20-alpine` (or `18`).
2.  **Builder:** Install dependencies (pnpm), build the specific app.
3.  **Runner:** Copy built artifacts (`dist/`) and `node_modules` (prod only) and run `node dist/main`.

*Note: Since this is a monorepo with shared local packages, the Docker build context needs to be the **root** of the monorepo, or we need to use `turbo prune`.*

### 2. Update `docker-compose.yml`

Extend the existing `docker-compose.yml` (or create a new `docker-compose.app.yml` to merge) to include the application services.

**New Services to Add:**

- **`api-gateway`**
  - **Build Context:** `.` (Root)
  - **Dockerfile:** `./apps/api-gateway/Dockerfile`
  - **Ports:** `3000:3000`
  - **Environment:**
    - `PORT=3000`
    - `RABBITMQ_URL=amqp://guest:guest@edufy-rabbitmq:5672`
    - `AUTH_SERVICE_HOST=auth-api`
    - `AUTH_SERVICE_PORT=3001`
    - (Add other service hosts/ports)
  - **Depends On:** `rabbitmq`

- **`auth-api`**
  - **Build Context:** `.`
  - **Dockerfile:** `./apps/auth-api/Dockerfile`
  - **Environment:**
    - `DATABASE_URL=postgresql://auth_user:auth_password@edufy-auth-db:5432/auth_db`
    - `RABBITMQ_URL=...`
    - `PORT=3001` (TCP)
  - **Depends On:** `auth-db`, `rabbitmq`

- **`users-api`**, **`courses-api`**, **`enrollments-api`**, **`support-api`**
  - Similar configuration with respective DBs and ports (TCP).

### 3. Environment Variable Standardization

- Ensure all apps accept configuration via `process.env` (which seems true based on `main.ts` reading `process.env.PORT` and `ConfigService`).
- Create a `.env.docker` file to hold shared Docker-specific variables if needed, or define them directly in `docker-compose.yml`.

### 4. Network Configuration

- Ensure all new app services join the existing `edufy-network`.
- Verify service-to-service communication uses Docker service names (e.g., `api-gateway` calls `auth-api` via hostname `auth-api`).

### 5. Database Migrations (Startup)

- **Challenge:** New containers usually start with empty DBs (after init scripts).
- **Solution:** Add a startup command or entrypoint script to run migrations (`pnpm run migrate`) before starting the app, or have a separate "migrator" service.
- **Alternative:** For dev, manually run `turbo run migrate` from host, or use `command: sh -c "npx kysely migrate:latest && node dist/main"`.

## High-Level Task List

1.  [ ] **Design Dockerfile Template:** Create a reusable Dockerfile compatible with the pnpm monorepo structure.
2.  [ ] **Apply Dockerfiles:** Add `Dockerfile` to all 6 application directories.
3.  [ ] **Configure Compose:** Add the 6 services to `docker-compose.yml`, linking them to their respective databases and RabbitMQ.
4.  [ ] **Env Config:** define `DATABASE_URL` and `RABBITMQ_URL` for each service in `docker-compose.yml`.
5.  [ ] **Migration Strategy:** Decide on and implement auto-migration on container startup.
6.  [ ] **Validation:** Run `docker compose up --build` and verify all services are healthy and communicating.
