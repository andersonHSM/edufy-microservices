# Relatório de Status da Migração de Rotas

Este documento detalha o status da migração das rotas do projeto monolítico para a nova arquitetura de microsserviços.

## Legenda

- **[OK]**: Rota migrada e funcionando no novo microsserviço.
- **[Pendente]**: Rota ainda não migrada.
- **[Parcial]**: Rota parcialmente migrada, mas com funcionalidades faltando.
- **[Mover]**: Rota existe, mas precisa ser movida para um microsserviço mais apropriado.

## Protocolos de Comunicação

- **Lógica Síncrona (Request/Response):** TCP (`@MessagePattern`)
  - Usado quando o Gateway precisa aguardar uma resposta do microsserviço para retornar ao cliente (ex: Login, GET dados).
- **Lógica Assíncrona (Event-Based):** RabbitMQ (`@EventPattern`)
  - Usado para efeitos colaterais ou processamento em background onde o Gateway não aguarda a conclusão (ex: Enviar email de boas-vindas).

---

## 1. Auth Service (`auth-api`)

| Método | Rota (Monolito) | Status         | Rota (Microsserviço)             | Rota (API Gateway) | Notas                                                                              |
|:-------|:----------------|:---------------|:---------------------------------|:-------------------|:-----------------------------------------------------------------------------------|
| `POST` | `/users`        | **[OK]**       | `@MessagePattern('create_user')` / `@EventPattern('user_created')` | `POST /users`      | A rota de criação de usuário (`signup`) foi migrada (Síncrono - TCP) e emite evento assíncrono (RabbitMQ). |
| `POST` | `/users/login`  | **[Pendente]** | `@MessagePattern('auth_login')`  | `POST /auth/login` | A lógica de login deve ser centralizada no `auth-api`. **[Protocolo: TCP]**        |

---

## 2. Users Service (`users-api`)

| Método | Rota (Monolito) | Status | Rota (Microsserviço) | Rota (API Gateway) | Notas |
|:---|:---|:---|:---|:---|:---|
| `GET` | `/users/me` | **[OK]** | `@MessagePattern('get_user_by_id')` | `GET /users/me` | O gateway injeta o ID do usuário token. Monolito busca `ticketsResolved`, o que deve ser removido. **[Protocolo: TCP]** |
| `PATCH` | `/users/me` | **[Pendente]** | `@MessagePattern('update_user')` | `PATCH /users/me` | A ser implementado no `users-api`. **[Protocolo: TCP]** |
| `POST` | `/users/self-assign-role` | **[Pendente]** | `@MessagePattern('assign_role')` / `@EventPattern('user_role_assigned')` | `POST /users/me/role` | Atribuição de role pelo usuário (Síncrono - TCP) e notifica `auth-api` assincronamente (RabbitMQ). |

---

## 3. Courses Service (`courses-api`)

| Método | Rota (Monolito) | Status | Rota (Microsserviço) | Rota (API Gateway) | Notas |
|:---|:---|:---|:---|:---|:---|
| `GET` | `/courses` | **[Pendente]** | `@MessagePattern('list_courses')` | `GET /courses` | A ser criado no `courses-api`. **[Protocolo: TCP]** |
| `GET` | `/courses/:id` | **[Pendente]** | `@MessagePattern('get_course_by_id')` | `GET /courses/:id` | A ser criado no `courses-api`. **[Protocolo: TCP]** |
| `GET` | `/users/me/courses` | **[Mover]** | `@MessagePattern('list_my_courses')` | `GET /courses/my-courses` | Esta rota deve ser movida para o `courses-api` e receber o `userId` do `api-gateway`. **[Protocolo: TCP]** |

---

## 4. Enrollments Service (`enrollments-api`)

| Método | Rota (Monolito) | Status | Rota (Microsserviço) | Rota (API Gateway) | Notas |
|:---|:---|:---|:---|:---|:---|
| `POST` | `/courses/:id/checkout` | **[Pendente]** | `@MessagePattern('create_enrollment')` | `POST /enrollments` | A ser criado no `enrollments-api`. **[Protocolo: TCP]** |
| `GET` | `/users/me/enrollments` | **[Mover]** | `@MessagePattern('list_my_enrollments')` | `GET /enrollments/my-enrollments` | Esta rota deve ser movida para o `enrollments-api`. **[Protocolo: TCP]** |
| `GET` | `/payments/purchases/:id` | **[Mover]** | `@MessagePattern('get_enrollment_by_id')` | `GET /enrollments/:id` | Esta rota deve ser movida para o `enrollments-api`. **[Protocolo: TCP]** |
| `GET` | `/payments/purchase-history` | **[Mover]** | `@MessagePattern('get_purchase_history')` | `GET /enrollments/my-history` | Esta rota deve ser movida para o `enrollments-api`. **[Protocolo: TCP]** |

---

## 5. Support Service (`support-api`)

| Método | Rota (Monolito) | Status | Rota (Microsserviço) | Rota (API Gateway) | Notas |
|:---|:---|:---|:---|:---|:---|
| `POST` | `/support/agent/tickets/:id/resolve` | **[Pendente]** | `@MessagePattern('resolve_ticket')` | `POST /support/tickets/:id/resolve` | A ser criado no `support-api`. **[Protocolo: TCP]** |
| `POST` | `/support/client/tickets` | **[Pendente]** | `@MessagePattern('create_ticket')` | `POST /support/tickets` | A ser criado no `support-api`. **[Protocolo: TCP]** |
| `GET` | `/support/client/tickets` | **[Pendente]** | `@MessagePattern('list_my_tickets')` | `GET /support/tickets` | A ser criado no `support-api`. **[Protocolo: TCP]** |
| `POST` | `/support/tickets/:id/reply` | **[Pendente]** | `@MessagePattern('reply_ticket')` | `POST /support/tickets/:id/reply` | A ser criado no `support-api`. **[Protocolo: TCP]** |
| `GET` | `/support/tickets/:id` | **[Pendente]** | `@MessagePattern('get_ticket_by_id')` | `GET /support/tickets/:id` | A ser criado no `support-api`. **[Protocolo: TCP]** |

---

## Resumo e Próximos Passos

- **Auth & Users**: A maior parte da funcionalidade de autenticação e gerenciamento de usuários já foi migrada ou tem um
  plano claro. As rotas que faltam (`/login`, `/users/me/role`, `/users/me`) são a prioridade.
- **Courses**: Nenhuma rota foi migrada ainda. A criação do serviço `courses-api` é o próximo grande passo.
- **Enrollments**: A criação do serviço `enrollments-api` cuidará das compras e inscrições.
- **Support**: Nenhuma rota foi migrada. A criação do `support-api` pode ser feita em paralelo com os outros serviços.

---

## Mapeamento de Dependências e Fluxo de Dados

Cada microsserviço possui seu próprio banco de dados. A comunicação entre eles para consistência e acesso a dados segue os padrões definidos abaixo.

### 1. Auth Service (`auth-api`)
- **Dados (Owns):** Credenciais (`email`, `password_hash`), `role`, Tokens JWT.
- **Dependências Síncronas (TCP):** Nenhuma (Source of Truth de autenticação).
- **Eventos Assíncronos (RabbitMQ):**
  - **Emite:** `user_created` (para `users-api` criar perfil).
  - **Escuta:** `user_role_assigned` (de `users-api` para atualizar claims de role).

### 2. Users Service (`users-api`)
- **Dados (Owns):** Perfil (`name`, `biography`, `interests`, `profilePictureUrl`).
- **Dependências Síncronas (TCP):** Nenhuma direta para operações básicas.
- **Eventos Assíncronos (RabbitMQ):**
  - **Emite:** `user_role_assigned` (para `auth-api`).
  - **Escuta:** `user_created` (de `auth-api` para criar registro inicial de perfil).

### 3. Courses Service (`courses-api`)
- **Dados (Owns):** Cursos (`title`, `description`, `price`, `instructorId`).
- **Dependências Síncronas (TCP):**
  - `get_user_profile` (de `users-api`): Para exibir nome do instrutor na listagem de cursos (ou replicar dados via evento se alta performance for necessária).
- **Eventos Assíncronos (RabbitMQ):**
  - **Emite:** `course_created`, `course_updated`.
  - **Escuta:** `enrollment_created` (de `enrollments-api` para atualizar contador de alunos - opcional).

### 4. Enrollments Service (`enrollments-api`)
- **Dados (Owns):** Matrículas/Compras (`studentId`, `courseId`, `status`, `paymentDetails`).
- **Dependências Síncronas (TCP):**
  - `get_course_details` (de `courses-api`): Para validar preço e existência do curso antes da compra.
  - `get_user_profile` (de `users-api`): Para validar se usuário existe e é estudante.
- **Eventos Assíncronos (RabbitMQ):**
  - **Emite:** `enrollment_created` (para notificar `courses-api` e talvez `support-api` se houver SLA diferenciado).

### 5. Support Service (`support-api`)
- **Dados (Owns):** Tickets (`title`, `description`, `status`, `creatorId`, `messages`).
- **Dependências Síncronas (TCP):**
  - `get_user_profile` (de `users-api`): Para exibir detalhes do autor do ticket para o agente.
- **Eventos Assíncronos (RabbitMQ):**
  - **Escuta:** `user_created` (opcional, para pré-cadastro), `enrollment_created` (para prioridade de suporte).
