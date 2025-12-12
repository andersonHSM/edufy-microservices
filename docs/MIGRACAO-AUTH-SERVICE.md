# Plano de Migração: Auth Service (`auth-api`)

## Objetivo

Centralizar a lógica de autenticação e gerenciamento de tokens JWT, migrando as funcionalidades do monolito (
`UserController`) para o microsserviço `auth-api`.

## Protocolos

- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Configuração de Filas (RabbitMQ)

- **Fila Principal:** `auth_queue`
- **Exchange de DLQ:** `auth_dlx`
- **Routing Key de DLQ:** `auth_dlq_routing_key`
- **Fila de DLQ:** `auth_dlq`

## Rotas a Migrar

| Origem (Monolito)      | Destino (Microserviço - TCP)     | Destino (Gateway - HTTP) | Status        |
| :--------------------- | :------------------------------- | :----------------------- | :------------ |
| `POST /users` (Signup) | `@MessagePattern('create_user')` | `POST /users`            | **[OK]**      |
| `POST /users/login`    | `@MessagePattern('auth_login')`  | `POST /auth/login`       | **[Parcial]** |

_(Nota: `POST /users` também emite o evento `@EventPattern('user_created')`)_

## Estratégia de Dados (Duplicação)

- **Papel:** Source of Truth para Credenciais.

- **Dependências:** Nenhuma.

- **Responsabilidade de Eventos:**
  - Emitir `user_created` sempre que um usuário se cadastrar.

  - Escutar `user_role_assigned` para atualizar roles no token.

  - **(Nota Importante para Consumidor):** O listener para `user_role_assigned` deve implementar
    `manual acknowledgement` e DLQ para garantir resiliência.

## Modelagem de Dados

| Campo        | Tipo   | Origem                | Descrição                                              |
| :----------- | :----- | :-------------------- | :----------------------------------------------------- |
| `sub`        | UUID   | `UserEntity.id`       | Identificador único global (gerado aqui, JWT Subject). |
| `email`      | String | `UserEntity.email`    | Identificador de login (Unique).                       |
| `password`   | String | `UserEntity.password` | Hash da senha (Argon2).                                |
| `role`       | Enum   | `UserEntity.role`     | 'student' ou 'instructor'. Pode ser null inicialmente. |
| `created_at` | Date   | (Novo)                | Data de criação.                                       |

## Próximos Passos

1. Implementar a rota de Login (TCP).
2. Garantir que o token gerado tenha o mesmo payload/claim structure do monolito para compatibilidade.
3. Implementar listener para `user_role_assigned`.
