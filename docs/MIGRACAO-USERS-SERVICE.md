# Plano de Migração: Users Service (`users-api`)

## Objetivo

Gerenciar o ciclo de vida, perfil e dados cadastrais dos usuários, separando essas responsabilidades do monolito.

## Protocolos

- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Rotas a Migrar

| Origem (Monolito)              | Destino (Microserviço - TCP)        | Destino (Gateway - HTTP) | Status         |
|:-------------------------------|:------------------------------------|:-------------------------|:---------------|
| `GET /users/me`                | `@MessagePattern('get_user_by_id')` | `GET /users/me`          | **[OK]**       |
| `PATCH /users/me`              | `@MessagePattern('update_user')`    | `PATCH /users/me`        | **[Pendente]** |
| `POST /users/self-assign-role` | `@MessagePattern('assign_role')`    | `POST /users/me/role`    | **[Pendente]** |

*(Nota: `PATCH /users/me` emite evento `user_updated`. `POST /users/self-assign-role` emite `user_role_assigned`)*

## Estratégia de Dados (Duplicação)

- **Papel:** Source of Truth para Dados Pessoais (Nome, Foto, Bio).
- **Responsabilidade de Eventos:**
    - **EMISSOR CRÍTICO:** Ao atualizar `name` ou `profilePictureUrl` na rota `PATCH /users/me`, DEVE emitir o evento
      `user_updated` (payload `sub_id`).
    - Este evento é o gatilho para `courses`, `enrollments` e `support` atualizarem suas cópias locais.
    - **Escuta:** `user_created` (de `auth-api`, payload `sub`) para criar registro inicial de perfil (`sub` como
      `sub_id`).

## Modelagem de Dados

| Campo                 | Tipo       | Origem                         | Descrição                                                             |
|:----------------------|:-----------|:-------------------------------|:----------------------------------------------------------------------|
| `sub_id`              | UUID       | `UserEntity.id`                | PK. Recebido do `auth-api` via evento `user_created` (payload `sub`). |
| `name`                | String     | `UserEntity.name`              | Nome completo.                                                        |
| `biography`           | String     | `UserEntity.biography`         | Texto descritivo.                                                     |
| `interests`           | JSON/Array | `UserEntity.interests`         | Lista de interesses.                                                  |
| `profile_picture_url` | String     | `UserEntity.profilePictureUrl` | URL da foto.                                                          |
| `email`               | String     | `UserEntity.email`             | **[Duplicado]** Cópia do Auth para facilitar busca/exibição.          |

## Próximos Passos

1. Implementar `update_user` (TCP).
2. Implementar `assign_role` (TCP) e emissão de evento `user_role_assigned`.
