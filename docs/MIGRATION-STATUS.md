# Relatório de Status da Migração de Rotas

Este documento detalha o status da migração das rotas do projeto monolítico para a nova arquitetura de microsserviços.

## Legenda

- **[OK]**: Rota migrada e funcionando no novo microsserviço.
- **[Pendente]**: Rota ainda não migrada.
- **[Parcial]**: Rota parcialmente migrada, mas com funcionalidades faltando.
- **[Mover]**: Rota existe, mas precisa ser movida para um microsserviço mais apropriado.

---

## 1. Auth Service (`auth-api`)

| Método | Rota (Monolito)           | Status         | Rota (Microsserviço) | Notas                                                  |
|:-------|:--------------------------|:---------------|:---------------------|:-------------------------------------------------------|
| `POST` | `/users`                  | **[OK]**       | `/users`             | A rota de criação de usuário (`signup`) foi migrada.   |
| `POST` | `/users/login`            | **[Pendente]** | `/auth/login`        | A lógica de login deve ser centralizada no `auth-api`. |

---

## 2. Users Service (`users-api`)

| Método  | Rota (Monolito)           | Status         | Rota (Microsserviço) | Notas                                                                                                                                                                         |
|:--------|:--------------------------|:---------------|:---------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GET`   | `/users/me`               | **[OK]**       | `/users/:subId`      | A rota foi migrada, mas o monolito busca `ticketsResolved`, o que é uma dependência do módulo de suporte. A versão do microsserviço deve retornar apenas os dados do usuário. |
| `PATCH` | `/users/me`               | **[Pendente]** | `/users/:subId`      | A ser implementado no `users-api`.                                                                                                                                            |
| `POST`  | `/users/self-assign-role` | **[Pendente]** | `/users/me/role`     | A ser implementado no `users-api`.                                                                                                                                            |

---

## 3. Courses Service (`courses-api`)

| Método | Rota (Monolito)     | Status         | Rota (Microsserviço)  | Notas                                                                                 |
|:-------|:--------------------|:---------------|:----------------------|:--------------------------------------------------------------------------------------|
| `GET`  | `/courses`          | **[Pendente]** | `/courses`            | A ser criado no `courses-api`.                                                        |
| `GET`  | `/courses/:id`      | **[Pendente]** | `/courses/:id`        | A ser criado no `courses-api`.                                                        |
| `GET`  | `/users/me/courses` | **[Mover]**    | `/courses/my-courses` | Esta rota deve ser movida para o `courses-api` e receber o `userId` do `api-gateway`. |

---

## 4. Enrollments Service (`enrollments-api`)

| Método | Rota (Monolito)              | Status         | Rota (Microsserviço)          | Notas                                                                                     |
|:-------|:-----------------------------|:---------------|:------------------------------|:------------------------------------------------------------------------------------------|
| `POST` | `/courses/:id/checkout`      | **[Pendente]** | `/enrollments`                | A ser criado no `enrollments-api`.                                                        |
| `GET`  | `/users/me/enrollments`      | **[Mover]**    | `/enrollments/my-enrollments` | Esta rota deve ser movida para o `enrollments-api` e receber o `userId` do `api-gateway`. |
| `GET`  | `/payments/purchases/:id`    | **[Mover]**    | `/enrollments/:id`            | Esta rota deve ser movida para o `enrollments-api`.                                       |
| `GET`  | `/payments/purchase-history` | **[Mover]**    | `/enrollments/my-history`     | Esta rota deve ser movida para o `enrollments-api`.                                       |

---

## 5. Support Service (`support-api`)

| Método | Rota (Monolito)                      | Status         | Rota (Microsserviço)           | Notas                          |
|:-------|:-------------------------------------|:---------------|:-------------------------------|:-------------------------------|
| `POST` | `/support/agent/tickets/:id/resolve` | **[Pendente]** | `/support/tickets/:id/resolve` | A ser criado no `support-api`. |
| `POST` | `/support/client/tickets`            | **[Pendente]** | `/support/tickets`             | A ser criado no `support-api`. |
| `GET`  | `/support/client/tickets`            | **[Pendente]** | `/support/tickets`             | A ser criado no `support-api`. |
| `POST` | `/support/tickets/:id/reply`         | **[Pendente]** | `/support/tickets/:id/reply`   | A ser criado no `support-api`. |
| `GET`  | `/support/tickets/:id`               | **[Pendente]** | `/support/tickets/:id`         | A ser criado no `support-api`. |

---

## Resumo e Próximos Passos

- **Auth & Users**: A maior parte da funcionalidade de autenticação e gerenciamento de usuários já foi migrada ou tem um
  plano claro. As rotas que faltam (`/login`, `/users/me/role`, `/users/me`) são a prioridade.
- **Courses**: Nenhuma rota foi migrada ainda. A criação do serviço `courses-api` é o próximo grande passo.
- **Enrollments**: A criação do serviço `enrollments-api` cuidará das compras e inscrições.
- **Support**: Nenhuma rota foi migrada. A criação do `support-api` pode ser feita em paralelo com os outros serviços.
