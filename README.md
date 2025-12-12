# Projeto de Microserviços

## Sobre

Este é um projeto desenvolvido durante um curso de microserviços, utilizando TypeScript e tecnologias modernas para
desenvolvimento de software distribuído.

## Tecnologias

- TypeScript 5.9.2
- Turbo 2.5.8
- Prettier 3.6.2
- pnpm (Gerenciador de pacotes)
- Docker
- Kubernetes
- RabbitMQ
- Redis
- Kysely (ORM e Migrações)

## Arquitetura

O projeto é composto por diversos microsserviços independentes que se comunicam através de mensageria e APIs REST.

## Requisitos

- Node.js (versão 18 ou superior)
- pnpm instalado globalmente
- Docker
- Docker Compose
- Kubernetes CLI (kubectl)

## Instalação

Siga os passos abaixo para configurar e executar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/andersonHSM/edufy-microservices.git
    cd edufy-microservices
    ```

2.  **Instale as dependências:**
    Utilize pnpm para instalar todas as dependências do monorepo:
    ```bash
    pnpm install
    ```

3.  **Configure o ambiente local com Docker Compose:**
    Este projeto utiliza Docker Compose para gerenciar bancos de dados (Postgres), RabbitMQ e Redis.
    Certifique-se de que o Docker esteja em execução e execute:
    ```bash
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    ```
    *(Nota: `docker-compose.dev.yml` pode ser necessário para serviços de desenvolvimento específicos. Verifique o conteúdo dos arquivos para a configuração exata.)*

4.  **Execute as migrações do banco de dados:**
    Após os bancos de dados estarem em execução via Docker Compose, você pode aplicar as migrações:
    ```bash
    pnpm migrate
    ```

5.  **Inicie os microserviços em modo de desenvolvimento:**
    ```bash
    pnpm dev
    ```
    Isso iniciará todos os microserviços configurados no monorepo em modo de desenvolvimento.

## Scripts Úteis

-   `pnpm build`: Constrói todos os projetos.
-   `pnpm dev`: Inicia todos os projetos em modo de desenvolvimento.
-   `pnpm lint`: Executa o linting em todos os projetos.
-   `pnpm migrate`: Executa as migrações do banco de dados.
-   `pnpm format`: Formata o código com Prettier.
-   `pnpm check-types`: Verifica os tipos em todos os projetos.