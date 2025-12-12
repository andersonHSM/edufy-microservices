# Plano de Dockerização: Microsserviços Edufy

## Objetivo

Dockerizar todo o ecossistema de microsserviços Edufy para permitir um ambiente consistente de desenvolvimento e implantação. Isso envolve a criação de Dockerfiles otimizados para cada aplicação e um `docker-compose.yml` abrangente para orquestrar serviços, bancos de dados e message brokers.

## Status Atual

- **Infraestrutura:** O `docker-compose.yml` já existe e configura corretamente:
  - Bancos de dados Postgres para `auth`, `users`, `courses`, `enrollments`, `support`.
  - Redis.
  - RabbitMQ.
  - pgAdmin.
- **Aplicações:** Nenhuma configuração Docker existe atualmente para os serviços de aplicação (`api-gateway`, `auth-api`, etc.).

## Plano de Tarefas

### 1. Criar Dockerfiles para Cada Serviço

Crie um `Dockerfile` multi-estágio na raiz de cada aplicação (`apps/*/Dockerfile`).
O processo de build deve usar `turbo` para builds eficientes de monorepo, mas como queremos contêineres isolados, assumiremos um processo de build NestJS padrão por enquanto ou usaremos `turbo prune` se estivéssemos fazendo um contexto de build de nível raiz altamente otimizado.

**Estratégia:** Use um template `Dockerfile` consistente para todos os aplicativos NestJS.

**Aplicativos Alvo:**
- `apps/api-gateway`
- `apps/auth-api`
- `apps/users-api`
- `apps/courses-api`
- `apps/enrollments-api`
- `apps/support-api`

**Estrutura do Template:**
1.  **Base:** `node:20-alpine` (ou `18`).
2.  **Builder:** Instalar dependências (pnpm), construir o aplicativo específico.
3.  **Runner:** Copiar artefatos construídos (`dist/`) e `node_modules` (somente produção) e executar `node dist/main`.

*Nota: Como este é um monorepo com pacotes locais compartilhados, o contexto de build do Docker precisa ser a **raiz** do monorepo, ou precisamos usar `turbo prune`.*

### 2. Atualizar `docker-compose.yml`

Estenda o `docker-compose.yml` existente (ou crie um novo `docker-compose.app.yml` para mesclar) para incluir os serviços de aplicação.

**Novos Serviços a Adicionar:**

- **`api-gateway`**
  - **Contexto de Build:** `.` (Raiz)
  - **Dockerfile:** `./apps/api-gateway/Dockerfile`
  - **Portas:** `3000:3000`
  - **Variáveis de Ambiente:**
    - `PORT=3000`
    - `RABBITMQ_URL=amqp://guest:guest@edufy-rabbitmq:5672`
    - `AUTH_SERVICE_HOST=auth-api`
    - `AUTH_SERVICE_PORT=3001`
    - (Adicionar outros hosts/portas de serviço)
  - **Depende de:** `rabbitmq`

- **`auth-api`**
  - **Contexto de Build:** `.`
  - **Dockerfile:** `./apps/auth-api/Dockerfile`
  - **Variáveis de Ambiente:**
    - `DATABASE_URL=postgresql://auth_user:auth_password@edufy-auth-db:5432/auth_db`
    - `RABBITMQ_URL=...`
    - `PORT=3001` (TCP)
  - **Depende de:** `auth-db`, `rabbitmq`

- **`users-api`**, **`courses-api`**, **`enrollments-api`**, **`support-api`**
  - Configuração semelhante com seus respectivos DBs e portas (TCP).

### 3. Padronização de Variáveis de Ambiente

- Certifique-se de que todos os aplicativos aceitem configuração via `process.env` (o que parece ser verdade com base na leitura de `process.env.PORT` e `ConfigService` em `main.ts`).
- Crie um arquivo `.env.docker` para armazenar variáveis compartilhadas específicas do Docker, se necessário, ou defina-as diretamente em `docker-compose.yml`.

### 4. Configuração de Rede

- Garanta que todos os novos serviços de aplicativo se juntem à `edufy-network` existente.
- Verifique se a comunicação entre serviços usa nomes de serviço Docker (por exemplo, `api-gateway` chama `auth-api` via hostname `auth-api`).

### 5. Migrações de Banco de Dados (Inicialização)

- **Desafio:** Novos contêineres geralmente iniciam com DBs vazios (após scripts de inicialização).
- **Solução:** Adicione um comando de inicialização ou script de entrypoint para executar migrações (`pnpm run migrate`) antes de iniciar o aplicativo, ou tenha um serviço "migrador" separado.
- **Alternativa:** Para desenvolvimento, execute manualmente `turbo run migrate` do host, ou use `command: sh -c "npx kysely migrate:latest && node dist/main"`.

## Lista de Tarefas de Alto Nível

1.  [ ] **Projetar Template de Dockerfile:** Criar um Dockerfile reutilizável compatível com a estrutura do monorepo pnpm.
2.  [ ] **Aplicar Dockerfiles:** Adicionar `Dockerfile` a todos os 6 diretórios de aplicativos.
3.  [ ] **Configurar Compose:** Adicionar os 6 serviços ao `docker-compose.yml`, ligando-os aos seus respectivos bancos de dados e RabbitMQ.
4.  [ ] **Configuração de Ambiente:** definir `DATABASE_URL` e `RABBITMQ_URL` para cada serviço em `docker-compose.yml`.
5.  [ ] **Estratégia de Migração:** Decidir e implementar a auto-migração na inicialização do contêiner.
6.  [ ] **Validação:** Executar `docker compose up --build` e verificar se todos os serviços estão saudáveis e se comunicando.
