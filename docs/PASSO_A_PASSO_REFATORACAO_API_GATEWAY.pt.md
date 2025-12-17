# Refatoração do API Gateway

Este documento descreve os passos para reproduzir a refatoração realizada na revisão `7d17536` no serviço API Gateway. O objetivo das mudanças foi melhorar a formatação do código, organizar imports e remover referências não utilizadas.

## Passo 1: Limpeza de Imports no Filtro de Exceção RPC

No arquivo `apps/api-gateway/src/libs/exception-filters/rpc-to-http.exception-filter.ts`, remova o import não utilizado `throwError` da biblioteca `rxjs`.

**Arquivo:** `apps/api-gateway/src/libs/exception-filters/rpc-to-http.exception-filter.ts`

```typescript
// Antes
import {Observable, throwError} from "rxjs";

// Depois
import {Observable} from "rxjs";
```

## Passo 2: Ajuste de Formatação no Módulo Principal

No arquivo `apps/api-gateway/src/app.module.ts`, ajuste a formatação no array `providers` para garantir consistência de espaçamento.

**Arquivo:** `apps/api-gateway/src/app.module.ts`

```typescript
// Antes
providers: [AppService, {provide: APP_FILTER,  useClass: RpcToHttpExceptionFilter}],

// Depois
providers: [AppService, {provide: APP_FILTER, useClass: RpcToHttpExceptionFilter}],
```

## Passo 3: Organização e Formatação no Arquivo Main

No arquivo de entrada da aplicação, realize a limpeza de imports e padronize a formatação (indentação e quebras de linha).

**Arquivo:** `apps/api-gateway/src/main.ts`

1. **Reorganizar Imports:** Agrupe os imports de bibliotecas externas (como `@nestjs/core`, `@nestjs/swagger`) e imports locais separadamente.
2. **Remover Imports não utilizados:** Verifique se há imports que não são usados no arquivo e remova-os (ex: `RpcToHttpExceptionFilter` se não for instanciado diretamente no `bootstrap`).
3. **Formatação:** Ajuste a indentação e espaçamento do código dentro da função `bootstrap`.

```typescript
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppModule} from './app.module';
import {AllExceptionsFilter} from './filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT ?? 3000;

    const config = new DocumentBuilder()
        // ... configurações do swagger
        .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    app.useGlobalFilters(new AllExceptionsFilter());

    await app.listen(PORT, () => {
        console.log(`API Gateway is running on port ${PORT}`);
    });
}

bootstrap();
```
