# Plano de Migração: Courses Service (`courses-api`)

## Objetivo

Gerenciar o catálogo de cursos, incluindo criação, listagem e detalhes.

## Protocolos

- **Request/Response:** TCP (`@MessagePattern`)
- **Eventos:** RabbitMQ (`@EventPattern`)

## Rotas a Migrar

| Origem (Monolito)       | Destino (Microserviço - TCP)          | Destino (Gateway - HTTP)  | Status         |
|:------------------------|:--------------------------------------|:--------------------------|:---------------|
| `GET /courses`          | `@MessagePattern('list_courses')`     | `GET /courses`            | **[Pendente]** |
| `GET /courses/:id`      | `@MessagePattern('get_course_by_id')` | `GET /courses/:id`        | **[Pendente]** |
| `GET /users/me/courses` | `@MessagePattern('list_my_courses')`  | `GET /courses/my-courses` | **[Pendente]** |

## Estratégia de Dados (Duplicação)
- **Schema:** A tabela `courses` deve ter colunas `instructor_name` e `instructor_avatar`.
- **Escrita:**
  - Na criação (`create_course`), pegar dados do Token ou chamar `users-api` uma vez e salvar.
- **Atualização (Consumidor):**
  - Implementar `@EventPattern('user_updated')`.
  - Ao receber evento, buscar todos cursos onde `instructor_sub_id == event.sub_id` e atualizar nome/foto.
  - **(Nota Importante):** O consumidor do `user_updated` deve implementar `manual acknowledgement` e DLQ.
- **Benefício:** Zero latência de rede para exibir listagem de cursos.

## Modelagem de Dados

| Campo               | Tipo    | Origem                      | Descrição                           |
|:--------------------|:--------|:----------------------------|:------------------------------------|
| `id`                | UUID    | `CourseEntity.id`           | PK.                                 |
| `title`             | String  | `CourseEntity.title`        | Título do curso.                    |
| `description`       | Text    | `CourseEntity.description`  | Descrição detalhada.                |
| `price`             | Decimal | `CourseEntity.price`        | Preço.                              |
| `instructor_sub_id` | UUID    | `CourseEntity.instructorId` | FK lógica para o usuário instrutor. |
| `instructor_name`   | String  | **[Novo]**                  | Cópia do nome do instrutor (User).  |
| `instructor_avatar` | String  | **[Novo]**                  | Cópia da foto do instrutor (User).  |

*(Nota: Tabelas de Seções/Aulas do Learning Scope também serão criadas aqui, mas focando primeiro na migração)*

## Próximos Passos

- Criar o microsserviço `courses-api`.
