# Project Overview: Edufy Microservices

**Purpose**
Edufy is a distributed educational platform built using a microservices architecture. It allows for managing users, courses, enrollments, and support via independent services that communicate asynchronously.

**Architecture**
- **Monorepo**: Managed by **Turbo** and **pnpm**.
- **Framework**: **NestJS** for all microservices.
- **Communication**: Hybrid approach using **TCP** for direct service-to-service calls and **RabbitMQ** for event-driven asynchronous communication (with DLX/DLQ patterns).
- **Database**: **PostgreSQL** accessed via **Kysely** query builder.
- **Infrastructure**: Docker and Kubernetes.

**Key Services (Apps)**
- `api-gateway`: Entry point for external requests.
- `auth-api`: Authentication and authorization.
- `users-api`: User management.
- `courses-api`: Course catalog and management.
- `enrollments-api`: Student enrollments.
- `support-api`: Customer support/ticketing.

**Packages**
- `eslint-config`: Shared ESLint rules.
- `typescript-config`: Shared TSConfig.
