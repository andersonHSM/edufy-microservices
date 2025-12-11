# Relatório de Status da Migração de Rotas

**Nota Importante:** Todos os microsserviços que interagem com o banco de dados (`auth-api`, `users-api`, `courses-api`)
agora utilizam Kysely como ORM, garantindo uma abordagem unificada para acesso a dados.

## Estratégia de Banco de Dados

Cada microsserviço deve possuir seu próprio banco de dados isolado. Esta abordagem garante:

- **Autonomia:** Microsserviços podem evoluir e serem implantados independentemente, sem afetar outros serviços devido a
  alterações de esquema de banco de dados.
- **Acoplamento Fraco:** Reduz a dependência entre os serviços, tornando o sistema mais resiliente a falhas.
- **Escalabilidade:** Permite escalar bancos de dados individualmente conforme a necessidade de cada serviço.
- **Propriedade Clara:** Cada equipe ou serviço é responsável pelo seu próprio banco de dados e seus dados.

A replicação de dados entre serviços deve ser feita exclusivamente através de eventos assíncronos (e.g., RabbitMQ),
conforme detalhado na seção "Mapeamento de Dependências e Fluxo de Dados". Evite acesso direto ou compartilhamento de
bancos de dados entre microsserviços.

Este documento detalha o status da migração das rotas do projeto monolítico para a nova arquitetura de microsserviços.

## Legenda

- **[OK]**: Rota migrada e funcionando no novo microsserviço.
- **[Pendente]**: Rota ainda não migrada.
- **[Parcial]**: Rota parcialmente migrada, mas com funcionalidades faltando.
- **[Mover]**: Rota existe, mas precisa ser movida para um microsserviço mais apropriado.

## Protocolos de Comunicação

- **Lógica Síncrona (Request/Response):** TCP (`@MessagePattern`)
    - Usado estritamente para validações críticas ou operações de escrita que exigem consistência imediata (ex: Login,
      Checkout).
- **Lógica Assíncrona (Event-Based):** RabbitMQ (`@EventPattern`)
    - Usado para propagação de dados (Data Duplication) e efeitos colaterais, garantindo desacoplamento em tempo de
      execução (Runtime Decoupling).
    - **Mecanismos de Resiliência:** Todos os consumidores de RabbitMQ DEVEM implementar `manual acknowledgement` e
      configurar uma `Dead Letter Queue (DLQ)` para mensagens que falham no processamento, garantindo que nenhum evento
      seja perdido e permitindo reprocessamento ou análise posterior.

---

## 1. Auth Service (`auth-api`)

| Método | Rota (Monolito) | Status   | Rota (Microsserviço)                                               | Rota (API Gateway) | Notas                                                                                                      |
|:-------|:----------------|:---------|:-------------------------------------------------------------------|:-------------------|:-----------------------------------------------------------------------------------------------------------|
| `POST` | `/users`        | **[OK]** | `@MessagePattern('create_user')` / `@EventPattern('user_created')` | `POST /users`      | A rota de criação de usuário (`signup`) foi migrada (Síncrono - TCP) e emite evento assíncrono (RabbitMQ). |
| `POST` | `/users/login`  | **[OK]** | `@MessagePattern('auth_login')`                                    | `POST /auth/login` | Rota de login agora exposta via API Gateway. **[Protocolo: TCP]**                                          |

---

## 2. Users Service (`users-api`)

| Método  | Rota (Monolito)           | Status   | Rota (Microsserviço)                                                     | Rota (API Gateway)    | Notas                                                                                                                       |
|:--------|:--------------------------|:---------|:-------------------------------------------------------------------------|:----------------------|:----------------------------------------------------------------------------------------------------------------------------|
| `GET`   | `/users/me`               | **[OK]** | `@MessagePattern('getUserById')`                                         | `GET /users/me`       | O gateway injeta o SUB_ID do usuário token. Monolito busca `ticketsResolved`, o que deve ser removido. **[Protocolo: TCP]** |
| `PATCH` | `/users/me`               | **[OK]** | `@MessagePattern('update_user')` / `@EventPattern('user_updated')`       | `PATCH /users/me`     | Implementado. Atualiza localmente e emite evento `user_updated`. **[Protocolo: TCP + RabbitMQ]**                            |
| `POST`  | `/users/self-assign-role` | **[OK]** | `@MessagePattern('assign_role')` / `@EventPattern('user_role_assigned')` | `POST /users/me/role` | Atribuição de role pelo usuário (Síncrono - TCP) e notifica `auth-api` assincronamente (RabbitMQ).                          |

---

## 3. Courses Service (`courses-api`)

| Método | Rota (Monolito)     | Status   | Rota (Microsserviço)                  | Rota (API Gateway)        | Notas                                                                                                           |
|:-------|:--------------------|:---------|:--------------------------------------|:--------------------------|:----------------------------------------------------------------------------------------------------------------|
| `GET`  | `/courses`          | **[OK]** | `@MessagePattern('list_courses')`     | `GET /courses`            | Lista cursos com dados do instrutor replicados localmente. **[Protocolo: TCP]**                                 |
| `GET`  | `/courses/:id`      | **[OK]** | `@MessagePattern('get_course_by_id')` | `GET /courses/:id`        | Retorna detalhes com dados do instrutor replicados. **[Protocolo: TCP]**                                        |
| `GET`  | `/users/me/courses` | **[OK]** | `@MessagePattern('list_my_courses')`  | `GET /courses/my-courses` | Esta rota deve ser movida para o `courses-api` e receber o `user_sub_id` do `api-gateway`. **[Protocolo: TCP]** |

---

## 4. Enrollments Service (`enrollments-api`)

| Método | Rota (Monolito)              | Status   | Rota (Microsserviço)                        | Rota (API Gateway)                | Notas                                                                                                                                                                                                  |
|:-------|:-----------------------------|:---------|:--------------------------------------------|:----------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `POST` | `/courses/:id/checkout`      | **[OK]** | `@MessagePattern('create_enrollment')`      | `POST /enrollments`               | Valida curso via TCP (ou réplica). Cria matrícula com snapshot de dados. **[Protocolo: TCP]**                                                                                                          |
| `Job`  | `enroll-student`             | **[OK]** | `@MessagePattern('enroll_student_request')` | N/A                               | Substitui o job `pg-boss` do monolito por um consumidor RabbitMQ para processar a matrícula de forma assíncrona após a compra, com suporte a `manual acknowledgement` e DLQ. **[Protocolo: RabbitMQ]** |
| `GET`  | `/users/me/enrollments`      | **[OK]** | `@MessagePattern('list_my_enrollments')`    | `GET /enrollments/my-enrollments` | Lista matrículas usando dados replicados do curso. **[Protocolo: TCP]**                                                                                                                                |
| `GET`  | `/payments/purchases/:id`    | **[OK]** | `@MessagePattern('get_enrollment_by_id')`   | `GET /enrollments/:id`            | Detalhes da compra. **[Protocolo: TCP]**                                                                                                                                                               |
| `GET`  | `/payments/purchase-history` | **[OK]** | `@MessagePattern('get_purchase_history')`   | `GET /enrollments/my-history`     | Histórico usando dados replicados. **[Protocolo: TCP]**                                                                                                                                                |

---

## 5. Support Service (`support-api`)

| Método | Rota (Monolito)                      | Status   | Rota (Microsserviço)                  | Rota (API Gateway)                  | Notas                                                                                  |
|:-------|:-------------------------------------|:---------|:--------------------------------------|:------------------------------------|:---------------------------------------------------------------------------------------|
| `POST` | `/support/agent/tickets/:id/resolve` | **[OK]** | `@MessagePattern('resolve_ticket')`   | `POST /support/tickets/:id/resolve` | A ser criado no `support-api`. **[Protocolo: TCP]**                                    |
| `POST` | `/support/client/tickets`            | **[OK]** | `@MessagePattern('create_ticket')`    | `POST /support/tickets`             | Cria ticket persistindo dados básicos do usuário autor (réplica). **[Protocolo: TCP]** |
| `GET`  | `/support/client/tickets`            | **[OK]** | `@MessagePattern('list_my_tickets')`  | `GET /support/tickets`              | Lista tickets usando dados replicados. **[Protocolo: TCP]**                            |
| `POST` | `/support/tickets/:id/reply`         | **[OK]** | `@MessagePattern('reply_ticket')`     | `POST /support/tickets/:id/reply`   | A ser criado no `support-api`. **[Protocolo: TCP]**                                    |
| `GET`  | `/support/tickets/:id`               | **[OK]** | `@MessagePattern('get_ticket_by_id')` | `GET /support/tickets/:id`          | A ser criado no `support-api`. **[Protocolo: TCP]**                                    |

---

## Mapeamento de Dependências e Fluxo de Dados (Strategic Data Duplication)

Para garantir **Runtime Decoupling**, os serviços duplicam dados essenciais de outros domínios e os mantêm atualizados
via Eventos.

### 1. Auth Service (`auth-api`)

- **Dados (Owns):** Credenciais, Role.
- **Duplicação (Recebe):**
    - Nenhuma (Autossuficiente).
- **Eventos (Emite):**
    - `user_created` (`user_sub_id`): Para outros serviços criarem suas réplicas/perfis.

### 2. Users Service (`users-api`)

- **Dados (Owns):** Perfil Completo.
- **Duplicação (Recebe):**
    - Nenhuma (Autossuficiente).
- **Eventos (Emite):**
    - `user_updated` (`user_sub_id`): **CRÍTICO**. Disparado ao alterar nome/foto. Consumido por `courses`,
      `enrollments`, `support`
      para atualizar réplicas.
    - `user_role_assigned` (`user_sub_id`, `role`): Para `auth-api`.

### 3. Courses Service (`courses-api`)

- **Dados (Owns):** Cursos.
- **Duplicação (Mantém Cópia):**
    - `instructor_name`, `instructor_photo`: Salvo na tabela `courses`.
- **Dependências:**
    - **Síncrona (TCP):** Validação de existência de usuário (apenas na criação do curso, se não confiar no token).
    - **Assíncrona (RabbitMQ):** Escuta `user_updated` para atualizar dados do instrutor nos cursos.
- **Eventos (Emite):**
    - `course_updated`: Para `enrollments-api` atualizar títulos/preços (se aplicável).

### 4. Enrollments Service (`enrollments-api`)

- **Dados (Owns):** Matrículas.
- **Duplicação (Mantém Cópia):**
    - `course_title`, `course_thumbnail`: Snapshot no momento da matrícula.
    - `student_name`: Cópia para listagem rápida.
- **Dependências:**
    - **Síncrona (TCP):** Validação de `course_id` e `user_sub_id` no checkout (pode ser evitada se tivermos tabela de
      réplica completa, mas validação síncrona é mais segura para pagamentos).
    - **Assíncrona (RabbitMQ):** Escuta `user_updated` (atualizar nome do aluno) e `course_updated` (actualizar título
      do
      curso).

### 5. Support Service (`support-api`)

- **Dados (Owns):** Tickets.
- **Duplicação (Mantém Cópia):**
    - `author_name`, `author_email`: Salvo no ticket.
- **Dependências:**
    - **Assíncrona (RabbitMQ):** Escuta `user_updated` para manter dados do autor atualizados (ou aceita que o ticket é
      um snapshot histórico).