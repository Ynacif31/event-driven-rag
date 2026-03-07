# Event-Driven RAG — Semantic Search with Real-Time Indexing

RAG (Retrieval-Augmented Generation) system that keeps a vector index in sync with document changes using event-driven architecture.

## Problem

Traditional RAG systems can answer from stale indexes. When documents change, the vector store may lag or never update, leading to outdated or hallucinated answers.

## Solution

- **Document Service** persists documents and publishes `document.updated` to RabbitMQ.
- **Indexer Service** consumes events, chunks content, generates embeddings, and upserts into a vector DB.
- **Query Service** receives questions, runs similarity search, and returns relevant chunks (or LLM-generated answers).

## Stack

- TypeScript / Node.js
- RabbitMQ (event broker)
- Postgres (documents) + pgvector **or** Redis Vector Search
- OpenAI / Gemini (embeddings + LLM)

## Documentation

| Doc | Description |
|-----|-------------|
| [01-visao-geral](./docs/01-visao-geral.md) | Problem, solution, technical goals |
| [02-requisitos-funcionais](./docs/02-requisitos-funcionais.md) | Functional requirements |
| [03-requisitos-nao-funcionais](./docs/03-requisitos-nao-funcionais.md) | Non-functional requirements |
| [04-casos-de-uso](./docs/04-casos-de-uso.md) | Use cases |
| [05-eventos-e-modelo-de-mensagens](./docs/05-eventos-e-modelo-de-mensagens.md) | Events and message model |
| [06-arquitetura](./docs/06-arquitetura.md) | Architecture and diagram |
| [07-ci-cd-e-devops](./docs/07-ci-cd-e-devops.md) | CI/CD and DevOps |

## Planned Structure

```
/services
  /document-service
  /indexer-service
  /query-service
/infra
  docker-compose.yml
/.github/workflows
  ci.yml
```

## Decisions Pending

- Vector store for v1: **Redis Vector Search** vs **Postgres+pgvector**
- AI provider: OpenAI, Gemini, or other
