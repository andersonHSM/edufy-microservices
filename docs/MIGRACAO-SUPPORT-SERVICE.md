# Plano de Migração: Support Service (`support-api`)

## Objetivo

Sistema de Tickets de suporte (Helpdesk).

## Protocolos

- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Rotas a Migrar

| Origem (Monolito)                         | Destino (Microserviço - TCP)          | Destino (Gateway - HTTP)            | Status         |
|:------------------------------------------|:--------------------------------------|:------------------------------------|:---------------|
| `POST /support/client/tickets`            | `@MessagePattern('create_ticket')`    | `POST /support/tickets`             | **[Pendente]** |
| `GET /support/client/tickets`             | `@MessagePattern('list_my_tickets')`  | `GET /support/tickets`              | **[Pendente]** |
| `POST /support/tickets/:id/reply`         | `@MessagePattern('reply_ticket')`     | `POST /support/tickets/:id/reply`   | **[Pendente]** |
| `POST /support/agent/tickets/:id/resolve` | `@MessagePattern('resolve_ticket')`   | `POST /support/tickets/:id/resolve` | **[Pendente]** |
| `GET /support/tickets/:id`                | `@MessagePattern('get_ticket_by_id')` | `GET /support/tickets/:id`          | **[Pendente]** |

## Estratégia de Dados (Duplicação)

- **Schema:** Tabela `tickets` e `messages` devem ter `author_name` e `author_email`.

- **Escrita:**

    - Ao criar ticket/resposta, persistir dados do autor (do Token com `sub_id` ou TCP `users-api`).

- **Atualização (Consumidor):**

    - Escutar `user_updated` (payload `sub_id`).

    - Se um usuário muda de nome, atualizar tickets ABERTOS. Tickets FECHADOS podem manter histórico (decisão de
      negócio).

    - **(Nota Importante):** O consumidor do `user_updated` deve implementar `manual acknowledgement` e DLQ.

- **Benefício:** Painel do agente carrega instantaneamente sem N+1 requests para `users-api`.

## Modelagem de Dados

### Tabela: `tickets`

| Campo            | Tipo   | Origem                     | Descrição                     |
|:-----------------|:-------|:---------------------------|:------------------------------|
| `id`             | UUID   | `TicketEntity.id`          | PK.                           |
| `title`          | String | `TicketEntity.title`       | Título do problema.           |
| `description`    | Text   | `TicketEntity.description` | Descrição inicial.            |
| `status`         | Enum   | `TicketEntity.status`      | `open`, `resolved`, `closed`. |
| `creator_sub_id` | UUID   | `TicketEntity.createdBy`   | FK lógica do autor.           |
| `creator_name`   | String | **[Novo]**                 | Nome do autor (Cópia).        |
| `creator_email`  | String | **[Novo]**                 | Email do autor (Cópia).       |
| `resolved_by`    | UUID   | `TicketEntity.resolvedBy`  | ID do agente que resolveu.    |

### Tabela: `ticket_messages` (Replies)

| Campo           | Tipo   | Origem                  | Descrição                            |
|:----------------|:-------|:------------------------|:-------------------------------------|
| `id`            | UUID   | (Novo)                  | PK.                                  |
| `ticket_id`     | UUID   | -                       | FK do Ticket.                        |
| `content`       | Text   | `TicketReply.content`   | Conteúdo da mensagem.                |
| `author_sub_id` | UUID   | `TicketReply.createdBy` | FK lógica do autor da msg.           |
| `author_name`   | String | **[Novo]**              | Nome do autor no momento (Snapshot). |

## Próximos Passos

- Criar o microsserviço `support-api`.
