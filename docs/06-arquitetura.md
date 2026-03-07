# 6. Arquitetura

## Diagrama de Componentes (Excalidraw)

Desenhe no Excalidraw seguindo esta descrição:

### Caixas (Componentes)

| Componente       | Descrição                                                    |
|------------------|--------------------------------------------------------------|
| **Client**       | Aplicação ou usuário que consome as APIs                     |
| **Document Service** | API REST para CRUD de documentos; publica eventos       |
| **RabbitMQ**     | Message broker; exchange `document.events`, queue `document-updated` |
| **Indexer Service** | Consumidor de eventos; chunking, embeddings, gravação no Vector DB |
| **Vector DB**    | Redis Vector Search ou Postgres+pgvector                     |
| **Query Service**| API REST para consultas; similarity search + LLM            |
| **LLM API**      | OpenAI, Gemini ou outro provedor de embeddings/LLM           |

### Fluxos (Setas)

| Origem          | Destino         | Protocolo / Ação                                  |
|-----------------|-----------------|---------------------------------------------------|
| Client          | Document Service| HTTP — `POST/PUT/GET /documents`                   |
| Document Service| RabbitMQ        | Publish `document.updated`                        |
| RabbitMQ        | Indexer Service | Consume `document-updated`                        |
| Indexer Service | Vector DB       | Upsert embeddings                                 |
| Indexer Service | LLM API         | Chamada para gerar embeddings (opcional, se externo) |
| Client          | Query Service   | HTTP — `POST /query`                              |
| Query Service   | Vector DB       | Similarity search                                 |
| Query Service   | LLM API         | Chamada para embedding da query + geração de resposta |
| LLM API         | Query Service   | Retorno de embedding / resposta                   |
| Query Service   | Client          | Resposta HTTP com trechos ou resposta do LLM      |

### Resumo Visual (Texto)

```
[Client] --HTTP--> [Document Service] --publish--> [RabbitMQ]
                                                        |
                                                        v
[Client] --HTTP--> [Query Service] <--similarity-- [Vector DB]
       ^                  |                                ^
       |                  |                                |
       |                  +--embedding/LLM--> [LLM API]     |
       |                  |                                |
       +--response--------+                    [Indexer Service]
                                                      |
                                                      +--consume-- [RabbitMQ]
                                                      +--upsert--> [Vector DB]
```

---

## Tabela: Serviços x Responsabilidades

| Serviço           | Responsabilidade principal                                      |
|-------------------|-----------------------------------------------------------------|
| Document Service  | CRUD de documentos; publicar `document.updated`                 |
| Indexer Service   | Consumir eventos; chunking; gerar embeddings; salvar vetores    |
| Query Service     | Receber queries; buscar vetores; chamar LLM; retornar resposta  |
| RabbitMQ          | Bufferizar e rotear eventos entre serviços                      |
| Vector DB         | Armazenar embeddings; executar similarity search               |
