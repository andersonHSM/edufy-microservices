# Plano de Migração: Enrollments Service (`enrollments-api`)

## Objetivo
Gerenciar matrículas, compras e histórico de pagamentos.

## Protocolos
- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Rotas a Migrar

| Origem (Monolito) | Destino (Microserviço - TCP) | Destino (Gateway - HTTP) | Status |
|:---|:---|:---|:---|
| `POST /courses/:id/checkout` | `@MessagePattern('create_enrollment')` | `POST /enrollments` | **[Pendente]** |
| `GET /users/me/enrollments` | `@MessagePattern('list_my_enrollments')` | `GET /enrollments/my-enrollments` | **[Pendente]** |
| `GET /payments/purchase-history` | `@MessagePattern('get_purchase_history')` | `GET /enrollments/my-history` | **[Pendente]** |
| `GET /payments/purchases/:id` | `@MessagePattern('get_enrollment_by_id')` | `GET /enrollments/:id` | **[Pendente]** |

## Estratégia de Dados (Duplicação)
- **Schema:** A tabela `enrollments` deve armazenar SNAPSHOTS:
  - `course_title` (para não quebrar histórico se curso mudar nome ou for deletado).
  - `course_price_at_purchase`.
  - `student_name` (para facilitar listagem administrativa).
- **Escrita:**
  - No checkout, buscar dados atuais via TCP (`courses-api`, `users-api`) e persistir o snapshot.
- **Atualização (Consumidor):**
  - Escutar `user_updated` para atualizar `student_name` em matrículas ativas (opcional, histórico pode manter nome antigo).
  - Escutar `course_updated` (geralmente não altera histórico de compras, mas pode alterar "Meus Cursos" se for exibido via enrollments).

## Próximos Passos
- Criar o microsserviço `enrollments-api`.