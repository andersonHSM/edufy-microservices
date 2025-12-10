# Plano de Migração: Users Service (`users-api`)

## Objetivo
Gerenciar o ciclo de vida, perfil e dados cadastrais dos usuários, separando essas responsabilidades do monolito.

## Protocolos
- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Rotas a Migrar

| Origem (Monolito) | Destino (Microserviço - TCP) | Destino (Gateway - HTTP) | Status |
|:---|:---|:---|:---|
| `GET /users/me` | `@MessagePattern('get_user_by_id')` | `GET /users/me` | **[OK]** |
| `PATCH /users/me` | `@MessagePattern('update_user')` | `PATCH /users/me` | **[Pendente]** |
| `POST /users/self-assign-role` | `@MessagePattern('assign_role')` | `POST /users/me/role` | **[Pendente]** |

*(Nota: `PATCH /users/me` emite evento `user_updated`. `POST /users/self-assign-role` emite `user_role_assigned`)*

## Estratégia de Dados (Duplicação)
- **Papel:** Source of Truth para Dados Pessoais (Nome, Foto, Bio).
- **Responsabilidade de Eventos:**
  - **EMISSOR CRÍTICO:** Ao atualizar `name` ou `profilePictureUrl` na rota `PATCH /users/me`, DEVE emitir o evento `user_updated`.
  - Este evento é o gatilho para `courses`, `enrollments` e `support` atualizarem suas cópias locais.

## Próximos Passos
1. Implementar `update_user` (TCP).
2. Implementar `assign_role` (TCP) e emissão de evento `user_role_assigned`.