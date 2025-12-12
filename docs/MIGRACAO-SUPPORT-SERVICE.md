# Plano de Migração: Support Service (`support-api`)

## Objetivo

Sistema de Tickets de suporte (Helpdesk).

## Protocolos

- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Configuração de Filas (RabbitMQ)

- **Fila Principal:** `support_queue`
- **Exchange de DLQ:** `support_dlx`
- **Routing Key de DLQ:** `support_dlq_routing_key`
- **Fila de DLQ:** `support_dlq`

## Rotas a Migrar

| Origem (Monolito)                         | Destino (Microserviço - TCP)          | Destino (Gateway - HTTP)            | Status   |
| :---------------------------------------- | :------------------------------------ | :---------------------------------- | :------- |
| `POST /support/client/tickets`            | `@MessagePattern('create_ticket')`    | `POST /support/tickets`             | **[OK]** |
| `GET /support/client/tickets`             | `@MessagePattern('list_my_tickets')`  | `GET /support/tickets`              | **[OK]** |
| `POST /support/tickets/:id/reply`         | `@MessagePattern('reply_ticket')`     | `POST /support/tickets/:id/reply`   | **[OK]** |
| `POST /support/agent/tickets/:id/resolve` | `@MessagePattern('resolve_ticket')`   | `POST /support/tickets/:id/resolve` | **[OK]** |
| `GET /support/tickets/:id`                | `@MessagePattern('get_ticket_by_id')` | `GET /support/tickets/:id`          | **[OK]** |

## Estratégia de Dados (Duplicação)
