# Guia de Configuração e Integração do RabbitMQ

Este documento consolida as mudanças realizadas nas revisões `4.0` e `4.0.1`, focando na infraestrutura de mensageria com RabbitMQ introduzida no projeto `edufy-microservices`.

Este guia foi elaborado para desenvolvedores sem experiência prévia com o setup atual, explicando desde a infraestrutura até a integração nos microsserviços.

## 1. Infraestrutura (Docker)

O serviço de mensageria foi adicionado ao arquivo `docker-compose.yml`. Utilizamos a imagem oficial com o plugin de gerenciamento habilitado.

### Serviço RabbitMQ
No arquivo `docker-compose.yml`:

```yaml
rabbitmq:
  image: rabbitmq:3.13-management-alpine
  container_name: edufy-rabbitmq
  ports:
    - "5672:5672"   # Porta padrão para comunicação AMQP
    - "15672:15672" # Porta para a Interface de Gerenciamento Web
  volumes:
    - rabbitmq_data:/var/lib/rabbitmq/ # Persistência de dados
    - rabbitmq_log:/var/log/rabbitmq   # Persistência de logs
  healthcheck:
    test: [ "CMD", "rabbitmq-diagnostics", "ping" ]
```

### Variáveis de Ambiente
Novas variáveis foram adicionadas para configurar a conexão.

**Arquivo `.env.docker` (Infraestrutura):**
*   `RABBITMQ_DEFAULT_USER`: Usuário padrão (ex: guest).
*   `RABBITMQ_DEFAULT_PASS`: Senha padrão (ex: guest).

**Arquivo `.env` nos serviços (Aplicação):**
*   `RABBITMQ_URL`: String de conexão completa (ex: `amqp://guest:guest@localhost:5672`).
*   `RABBITMQ_USERS_QUEUE`: Nome da fila de usuários (ex: `users_queue`).

## 2. Topologia do RabbitMQ (Definitions)

Para garantir que exchanges e filas existam ao iniciar o contêiner (ou serem importadas manualmente), foi criado o arquivo `docker/rabbitmq/definitions.json`.

### Estrutura Definida

1.  **Exchange Principal (`users_exchange`):**
    *   Tipo: `direct`
    *   Função: Recebe mensagens direcionadas a eventos de usuário.

2.  **Fila Principal (`users_queue`):**
    *   Função: Fila onde os consumidores (Users API) buscarão mensagens.
    *   **Configuração de DLQ (Dead Letter Queue):** Se uma mensagem for rejeitada ou expirar, ela não é perdida. Ela é enviada automaticamente para a exchange de "carta morta" (`users_dlx`).
        *   `x-dead-letter-exchange`: `users_dlx`
        *   `x-dead-letter-routing-key`: `users_dlq_routing_key`

3.  **Dead Letter Exchange (`users_dlx`):**
    *   Tipo: `fanout`
    *   Função: Roteia mensagens falhas para a fila de DLQ.

4.  **Fila de Dead Letter (`users_dlq`):**
    *   Função: Armazena mensagens que falharam no processamento para análise posterior.

5.  **Bindings (Ligações):**
    *   `users_exchange` -> `users_queue` (com routing key: `user_signed_up`)
    *   `users_dlx` -> `users_dlq`

## 3. Integração nos Microsserviços

A comunicação mudou de síncrona (TCP direto em alguns casos) para assíncrona ou híbrida usando o pacote `@nestjs/microservices`.

### Dependências
Foram adicionados os pacotes:
*   `amqplib`: Biblioteca cliente AMQP para Node.js.
*   `amqp-connection-manager`: Gerenciador de conexão para reconexão automática.

### Configuração Centralizada
Em cada microsserviço (`api-gateway`, `auth-api`, `users-api`), foi criado/atualizado o módulo de configuração para validar as variáveis do RabbitMQ usando `zod`.

**Exemplo (`libs/configuration/rabbitmq.config.ts`):**
```typescript
const rabbitMQConfigSchema = z.object({
    url: z.string().min(1, 'RabbitMQ url is required'),
    usersQueue: z.string().min(1, 'RabbitMQ users queue is required'),
});
```

### Users API (Consumidor)
O serviço `users-api` foi alterado em seu `main.ts` para iniciar como um microsserviço RabbitMQ, ouvindo a fila configurada.

```typescript
// apps/users-api/src/main.ts
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
        transport: Transport.RMQ,
        options: {
            urls: [config.url],
            queue: config.usersQueue, // Conecta na 'users_queue'
            queueOptions: { durable: false },
        },
    },
);
```

### API Gateway e Auth API (Produtores)
Estes serviços registraram o cliente RabbitMQ em seus módulos (`app.module.ts`) para poderem enviar mensagens.

```typescript
// Exemplo de registro no AppModule
ClientsModule.registerAsync({
    clients: [
        {
            name: 'USERS_SERVICE', // Token de injeção
            useFactory: (config) => ({
                transport: Transport.RMQ,
                options: {
                    urls: [config.url],
                    queue: config.usersQueue,
                },
            }),
            inject: [rabbitmqConfig.KEY],
        },
    ]
})
```

## 4. Como Verificar

1.  Suba o ambiente:
    ```bash
    docker-compose up -d
    ```
2.  Acesse o Painel de Gerenciamento do RabbitMQ:
    *   URL: `http://localhost:15672`
    *   Usuário/Senha: `guest` / `guest` (ou conforme `.env.docker`)
3.  Verifique a aba **Queues** e **Exchanges** para confirmar se a topologia (`users_queue`, `users_exchange`, etc.) foi criada corretamente.

---
**Observação sobre Formatação:** A revisão `f0ca411` aplicou padronização de código (Prettier) em todo o projeto. Se notar diferenças grandes de indentação ao comparar arquivos, é devido a essa formatação automática.
