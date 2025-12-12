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
|:------------------------------------------|:--------------------------------------|:------------------------------------|:---------|
| `POST /support/client/tickets`            | `@MessagePattern('create_ticket')`    | `POST /support/tickets`             | **[OK]** |
| `GET /support/client/tickets`             | `@MessagePattern('list_my_tickets')`  | `GET /support/tickets`              | **[OK]** |
| `POST /support/tickets/:id/reply`         | `@MessagePattern('reply_ticket')`     | `POST /support/tickets/:id/reply`   | **[OK]** |
| `POST /support/agent/tickets/:id/resolve` | `@MessagePattern('resolve_ticket')`   | `POST /support/tickets/:id/resolve` | **[OK]** |
| `GET /support/tickets/:id`                | `@MessagePattern('get_ticket_by_id')` | `GET /support/tickets/:id`          | **[OK]** |

## Estratégia de Dados (Duplicação)

Para evitar acoplamento síncrono e latência excessiva em consultas de listagem, dados do usuário são duplicados nas
tabelas do serviço de suporte.

- **Tickets:** Armazenam `creator_name` e `creator_email` (desnormalizados).
- **Mensagens:** Armazenam `author_name` (desnormalizado).
- **Sincronização:** O serviço escuta o evento `user_updated` (via RabbitMQ) para atualizar os dados do criador nos
  tickets que ainda estão abertos (`TicketStatus.OPEN`).

## Modelagem de Dados

O banco de dados utiliza o schema `support`.

### Tabela: `tickets`

Armazena os tickets de suporte criados pelos usuários.

| Coluna           | Tipo           | Obrigatório | Default             | Descrição                                        |
|:-----------------|:---------------|:------------|:--------------------|:-------------------------------------------------|
| `id`             | `uuid`         | Sim         | `gen_random_uuid()` | Identificador único do ticket (PK).              |
| `title`          | `varchar(255)` | Sim         | -                   | Título do ticket.                                |
| `description`    | `text`         | Sim         | -                   | Descrição detalhada do problema.                 |
| `status`         | `varchar(50)`  | Sim         | -                   | Status do ticket (`open`, `resolved`, `closed`). |
| `creator_sub_id` | `uuid`         | Sim         | -                   | ID do usuário criador (Keycloak Sub ID).         |
| `creator_name`   | `varchar(255)` | Sim         | -                   | Nome do criador (cache).                         |
| `creator_email`  | `varchar(255)` | Sim         | -                   | Email do criador (cache).                        |
| `resolved_by`    | `uuid`         | Não         | -                   | ID do agente que resolveu o ticket.              |
| `created_at`     | `timestamp`    | Sim         | `now()`             | Data de criação.                                 |
| `updated_at`     | `timestamp`    | Sim         | `now()`             | Data de atualização.                             |

### Tabela: `ticket_messages`

Armazena as mensagens/respostas de um ticket.

| Coluna          | Tipo           | Obrigatório | Default             | Descrição                                           |
|:----------------|:---------------|:------------|:--------------------|:----------------------------------------------------|
| `id`            | `uuid`         | Sim         | `gen_random_uuid()` | Identificador único da mensagem (PK).               |
| `ticket_id`     | `uuid`         | Sim         | -                   | Referência ao ticket pai (FK). `ON DELETE CASCADE`. |
| `content`       | `text`         | Sim         | -                   | Conteúdo da mensagem.                               |
| `author_sub_id` | `uuid`         | Sim         | -                   | ID do autor da mensagem.                            |
| `author_name`   | `varchar(255)` | Sim         | -                   | Nome do autor (cache).                              |
| `created_at`    | `timestamp`    | Sim         | `now()`             | Data de envio da mensagem.                          |
