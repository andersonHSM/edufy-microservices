# Plano de Migração: Enrollments Service (`enrollments-api`)

## Objetivo

Gerenciar matrículas, compras e histórico de pagamentos.

## Protocolos

- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Configuração de Filas (RabbitMQ)

- **Fila Principal:** `enrollments_queue`
- **Exchange de DLQ:** `enrollments_dlx`
- **Routing Key de DLQ:** `enrollments_dlq_routing_key`
- **Fila de DLQ:** `enrollments_dlq`

## Rotas a Migrar

| Origem (Monolito)                | Destino (Microserviço - TCP)              | Destino (Gateway - HTTP)          | Status         |
|:---------------------------------|:------------------------------------------|:----------------------------------|:---------------|
| `POST /courses/:id/checkout`     | `@MessagePattern('create_enrollment')`    | `POST /enrollments`               | **[Pendente]** |
| `GET /users/me/enrollments`      | `@MessagePattern('list_my_enrollments')`  | `GET /enrollments/my-enrollments` | **[Pendente]** |
| `GET /payments/purchase-history` | `@MessagePattern('get_purchase_history')` | `GET /enrollments/my-history`     | **[Pendente]** |
| `GET /payments/purchases/:id`    | `@MessagePattern('get_enrollment_by_id')` | `GET /enrollments/:id`            | **[Pendente]** |

## Fluxos Assíncronos a Migrar

| Origem (Monolito)     | Destino (Microserviço - RabbitMQ)           | Gatilho                                   | Status         |
|:----------------------|:--------------------------------------------|:------------------------------------------|:---------------|
| `Job: enroll-student` | `@MessagePattern('enroll_student_request')` | Disparado após a conclusão de uma compra. | **[Pendente]** |

## Estratégia de Dados (Duplicação)

- **Schema:** A tabela `enrollments` deve armazenar SNAPSHOTS:

    - `course_title` (para não quebrar histórico se curso mudar nome ou for deletado).

    - `course_price_at_purchase`.

    - `student_name` (para facilitar listagem administrativa).

- **Escrita:**

    - No checkout, buscar dados atuais via TCP (`courses-api`, `users-api`) e persistir o snapshot. (Validação de
      `course_id` e `user_sub_id`)

- **Atualização (Consumidor):**

    - Escutar `user_updated` (payload `sub_id`) para atualizar `student_name` em matrículas ativas (opcional, histórico
      pode manter nome antigo).

    - Escutar `course_updated` (geralmente não altera histórico de compras, mas pode alterar "Meus Cursos" se for
      exibido via enrollments).

    - **(Nota Importante):** Consumidores de `user_updated` e `course_updated` devem implementar
      `manual acknowledgement` e DLQ.

## Modelagem de Dados

### Tabela: `enrollments` (Fusão de `Enrollment` e `Purchase`)

| Campo            | Tipo    | Origem                        | Descrição                         |
|:-----------------|:--------|:------------------------------|:----------------------------------|
| `id`             | UUID    | `PurchaseEntity.id`           | ID único da matrícula/compra.     |
| `student_sub_id` | UUID    | `EnrollmentEntity.studentId`  | FK lógica do aluno.               |
| `course_id`      | UUID    | `EnrollmentEntity.courseId`   | FK lógica do curso.               |
| `status`         | Enum    | `PurchaseEntity.status`       | `pending`, `completed`, `failed`. |
| `price_paid`     | Decimal | `PurchaseEntity.price`        | Valor pago (Snapshot).            |
| `enrolled_at`    | Date    | `EnrollmentEntity.enrolledAt` | Data da efetivação.               |
| `course_title`   | String  | **[Novo]**                    | Título do curso (Snapshot).       |
| `student_name`   | String  | **[Novo]**                    | Nome do aluno (Cópia).            |

## Próximos Passos

