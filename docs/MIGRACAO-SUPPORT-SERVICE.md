# Plano de Migração: Support Service (`support-api`)

## Objetivo
Sistema de Tickets de suporte (Helpdesk).

## Protocolos
- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Rotas a Migrar

| Origem (Monolito) | Destino (Microserviço - TCP) | Destino (Gateway - HTTP) | Status |
|:---|:---|:---|:---|
| `POST /support/client/tickets` | `@MessagePattern('create_ticket')` | `POST /support/tickets` | **[Pendente]** |
| `GET /support/client/tickets` | `@MessagePattern('list_my_tickets')` | `GET /support/tickets` | **[Pendente]** |
| `POST /support/tickets/:id/reply` | `@MessagePattern('reply_ticket')` | `POST /support/tickets/:id/reply` | **[Pendente]** |
| `POST /support/agent/tickets/:id/resolve` | `@MessagePattern('resolve_ticket')` | `POST /support/tickets/:id/resolve` | **[Pendente]** |
| `GET /support/tickets/:id` | `@MessagePattern('get_ticket_by_id')` | `GET /support/tickets/:id` | **[Pendente]** |

## Estratégia de Dados (Duplicação)
- **Schema:** Tabela `tickets` e `messages` devem ter `author_name` e `author_email`.
- **Escrita:**
  - Ao criar ticket/resposta, persistir dados do autor (do Token ou TCP `users-api`).
- **Atualização (Consumidor):**
  - Escutar `user_updated`.
  - Se um usuário muda de nome, atualizar tickets ABERTOS. Tickets FECHADOS podem manter histórico (decisão de negócio).
- **Benefício:** Painel do agente carrega instantaneamente sem N+1 requests para `users-api`.

## Próximos Passos
- Criar o microsserviço `support-api`.