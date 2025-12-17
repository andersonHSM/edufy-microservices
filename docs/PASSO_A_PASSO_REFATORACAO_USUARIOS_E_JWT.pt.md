# Refatoração: Módulo de Usuários, JWT e Kysely

Este documento detalha as mudanças realizadas na revisão `f77e18f` (3.4), que abrange a refatoração do módulo de usuários, implementação de autenticação JWT, validações com Zod e integração com banco de dados usando Kysely.

## 1. Instalação de Dependências

Novas bibliotecas foram adicionadas para lidar com JWT, validação de schemas (Zod) e hashing de senhas (Argon2).

```bash
pnpm add @nestjs/jwt zod argon2
pnpm add -D @types/jsonwebtoken
```

*Nota: As dependências devem ser instaladas nos projetos `api-gateway` e `auth-api` conforme a necessidade.*

## 2. Configuração Centralizada (Configuration Module)

Foi criado um módulo de configuração centralizado (`ConfigurationModule`) em ambos os serviços (`api-gateway` e `auth-api`) para carregar e validar variáveis de ambiente usando `zod`.

**Novos arquivos criados em `src/libs/configuration/`:**
*   `admin.config.ts`: Configuração para chave de admin.
*   `database.config.ts`: URL de conexão do banco.
*   `jwt.config.ts`: Segredo e expiração do JWT.
*   `webhook.config.ts` (apenas api-gateway): Segredo para webhooks.
*   `configuration.module.ts`: Módulo que agrega todos os configs e inicia o `ConfigModule`.

**Exemplo (`jwt.config.ts`):**
```typescript
import {registerAs} from '@nestjs/config';
import z from 'zod';

const jwtConfigSchema = z.object({
    secret: z.string().min(1, 'JWT secret is required'),
    expiration: z.string().min(1, 'JWT expiration is required').default('1h'),
});

export default registerAs('jwt', () =>
    jwtConfigSchema.parse({
        secret: process.env.JWT_SECRET,
        expiration: process.env.JWT_EXPIRATION,
    }),
);
```

## 3. Módulo de Banco de Dados (Auth API)

O serviço `auth-api` recebeu a configuração do Kysely para interação com o banco de dados.

**Novos arquivos em `apps/auth-api/src/libs/database/`:**
*   `database.module.ts`: Módulo global que exporta a conexão.
*   `database.provider.ts`: Configura a instância do Kysely com dialeto Postgres e plugins.
*   `kysely.repository.ts`: Classe base abstrata para repositórios.
*   `constants.ts`: Símbolo de injeção `DATABASE`.

O arquivo `kysely.config.ts` na raiz do `auth-api` também foi atualizado para apontar para a nova pasta de migrations (`./src/libs/database/migrations`).

## 4. Implementação de JWT

Um módulo customizado `ConfiguredJwtModule` foi criado para encapsular a configuração do `@nestjs/jwt`.

**Arquivo:** `src/libs/jwt/jwt.module.ts` (em ambos os apps)
```typescript
export const ConfiguredJwtModule = JwtModule.registerAsync({
    useFactory: (config: JwtConfig) => ({
        global: true,
        secret: config.secret,
        signOptions: {expiresIn: config.expiration},
    }),
    inject: [jwtConfig.KEY],
});
```

Também foi criada uma classe utilitária `Jwt` para manipulação/parse de tokens.

## 5. Refatoração do Módulo de Usuários (Auth API)

O módulo de usuários no `auth-api` foi reestruturado seguindo princípios de arquitetura limpa (camadas application, domain, infrastructure, presentation).

### Domain
*   **Entidade (`user.entity.ts`):** Classe rica representando o usuário.
*   **Interface de Repositório (`user.repository.ts`):** Contrato `IUserRepository`.
*   **Enums (`user.role.ts`):** Definição de papéis (Student, SupportAgent, Instructor).

### Infrastructure
*   **KyselyUserRepository (`kysely.user.repository.ts`):** Implementação do repositório usando Kysely.
*   **InMemoryUserRepository:** (Opcional) Implementação para testes.

### Application
*   **UsersService:** Atualizado para usar `argon2` para hash de senha e o repositório para persistência.

```typescript
// Exemplo de criação no UsersService
const newUser = UserEntity.create({
    email: signupUserDto.email,
    password: await argon2.hash(signupUserDto.password),
    role: signupUserDto.role,
});
await this.userRepository.save(newUser);
```

### Presentation
*   **UsersController:** Usa o decorator `@Public()` para permitir criação de conta sem autenticação prévia.
*   **JwtGuard:** Guardião global (ou por rota) que valida o token JWT e popula `request.user`.

## 6. API Gateway: Validação e Segurança

O `api-gateway` também recebeu atualizações significativas:

1.  **UsersModule:** Importa o `ConfiguredJwtModule`.
2.  **JwtGuard:** Implementado para proteger rotas no gateway, verificando a validade do token antes de repassar a requisição ou processar.
3.  **DTO (`SignupUserDto`):** Adicionada validação com `class-validator` e campo `role` (enum).
4.  **AppModule:** Importa `ConfigurationModule` e ajusta a configuração dos clientes de microserviço (TCP) usando as variáveis do `ConfigService`.

## 7. Variáveis de Ambiente

Os arquivos `.env.example` foram atualizados para incluir:
*   `JWT_SECRET`, `JWT_EXPIRATION`
*   `ADMIN_KEY`
*   `DATABASE_URL`
*   `AUTH_SERVICE_HOST`, `AUTH_SERVICE_PORT` (no gateway)

## Resumo da Estrutura de Pastas (Auth API)

```
src/
├── app/
│   └── users/
│       ├── application/   (Service)
│       ├── domain/        (Entity, Repository Interface, Value Objects)
│       ├── infrastructure/(Kysely Repository)
│       └── presentation/  (Controller, DTOs, Guards)
└── libs/
    ├── configuration/
    ├── database/
    └── jwt/
```
