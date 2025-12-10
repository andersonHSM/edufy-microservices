# Plano de Migração: Courses Service (`courses-api`)

## Objetivo
Gerenciar o catálogo de cursos, incluindo criação, listagem e detalhes.

## Protocolos
- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Rotas a Migrar

| Origem (Monolito) | Destino (Microserviço - TCP) | Destino (Gateway - HTTP) | Status |
|:---|:---|:---|:---|
| `GET /courses` | `@MessagePattern('list_courses')` | `GET /courses` | **[Pendente]** |
| `GET /courses/:id` | `@MessagePattern('get_course_by_id')` | `GET /courses/:id` | **[Pendente]** |
| `GET /users/me/courses` | `@MessagePattern('list_my_courses')` | `GET /courses/my-courses` | **[Pendente]** |

## Estratégia de Dados (Duplicação)
- **Schema:** A tabela `courses` deve ter colunas `instructor_name` e `instructor_avatar`.
- **Escrita:**
  - Na criação (`create_course`), pegar dados do Token ou chamar `users-api` uma vez e salvar.
- **Atualização (Consumidor):**
  - Implementar `@EventPattern('user_updated')`.
  - Ao receber evento, buscar todos cursos onde `instructorId == event.userId` e atualizar nome/foto.
- **Benefício:** Zero latência de rede para exibir listagem de cursos.

## Próximos Passos
- Criar o microsserviço `courses-api`.