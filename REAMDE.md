📂 projeto
├── 📂 src
│   ├── 📂 application  # Casos de uso (use-cases)
│   │   ├── 📂 services
│   │   │   ├── ClientService.ts
│   │   │   ├── MessageProducer.ts
│   │   ├── 📂 usecases
│   │   │   ├── ClientUseCase.ts
│   ├── 📂 domain  # Entidades e regras de negócio
│   │   ├── 📂 entities
│   │   │   ├── BaseEntity.ts
│   │   │   ├── Client.ts
│   │   ├── 📂 repositories
│   │   │   ├── IBaseRepository.ts
│   │   │   ├── IClientRepository.ts
│   ├── 📂 infrastructure  # Implementações técnicas
│   │   ├── 📂 database
│   │   │   ├── models
│   │   │   │   ├── ClientModel.ts
│   │   │   ├── MongoClientRepository.ts
│   │   ├── 📂 cache
│   │   │   ├── RedisClient.ts
│   │   ├── 📂 messaging
│   │   │   ├── MessageConsumer.ts
│   │   │   ├── RabbitMQ.ts
│   ├── 📂 presentation  # Interface da aplicação (controllers e rotas)
│   │   ├── 📂 controllers
│   │   │   ├── ClientController.ts
│   │   ├── 📂 routes
│   │   │   ├── clientRoutes.ts
│   ├── server.ts  # Ponto de entrada da API
├── 📂 tests  # Testes unitários
│   ├── 📂 application
│   ├── 📂 infrastructure
├── .env  # Variáveis de ambiente
├── .gitignore
├── docker-compose.yml  # Configuração dos serviços
├── Dockerfile  # Container da aplicação
├── package.json
├── tsconfig.json
├── README.md  # Documentação do projeto

# README.md

# Projeto: API de Cadastro e Consulta de Clientes

## Descrição
Este projeto implementa uma API REST para cadastro e consulta de clientes, seguindo os princípios da **Clean Architecture** e **SOLID**. A aplicação utiliza **Node.js (TypeScript + Express.js)**, **MongoDB**, **Redis** para caching e **Kafka/RabbitMQ** para mensageria.

## Tecnologias Utilizadas
- **Node.js + TypeScript**
- **Express.js** (Framework HTTP)
- **MongoDB** (Banco de dados NoSQL)
- **Redis** (Cache para otimizar consultas)
- **RabbitMQ** (Mensageria para eventos assíncronos)
- **Docker e Docker Compose** (Containerização)
- **Jest** (Testes unitários)

## Estrutura do Projeto
A aplicação segue uma arquitetura modular e bem organizada:
```
/src
  ├── application (Casos de uso)
  ├── domain (Entidades e repositórios)
  ├── infrastructure (Banco, cache, mensageria)
  ├── presentation (Controllers e rotas)
  ├── config (Configurações gerais)
  ├── server.ts (Ponto de entrada da API)
/tests (Testes unitários)
```

## Como Rodar o Projeto
### 1. Clonar o repositório
```bash
git clone https://github.com/JesseSatlei/dynadok.git
cd dynadok
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e defina as configurações necessárias.

### 3. Subir a aplicação com Docker
```bash
docker-compose up --build
```
Esse comando irá:

Construir a imagem Docker da aplicação usando o Dockerfile.
Criar e iniciar os containers para os serviços necessários: MongoDB, Redis e RabbitMQ.

### 4. Testar os endpoints
A API estará disponível em `http://localhost:3000`, deixarei um arquivo na raiz do projeto com o JSON para ser importado no postman

## Endpoints Disponíveis
| Método  | Rota               | Descrição                        |
|---------|--------------------|----------------------------------|
| POST    | /clients           | Cadastrar um novo cliente       |
| PUT     | /clients/:id       | Atualizar um cliente existente  |
| GET     | /clients/:id       | Buscar um cliente por ID        |
| GET     | /clients           | Listar todos os clientes        |
| DELETE  | /clients/:id       | Deletar um cliente              |

## Como Rodar os Testes
```bash
yarn test
```

## Considerações
Este projeto foi desenvolvido com foco em **qualidade de código, boas práticas e escalabilidade**. Qualquer sugestão de melhoria é bem-vinda!
