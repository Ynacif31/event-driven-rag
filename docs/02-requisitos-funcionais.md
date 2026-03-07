# 2. Requisitos Funcionais

## RF01 — Criação de Documentos

O sistema deve permitir criar documentos com título, conteúdo e metadados de permissão via API REST. O endpoint `POST /documents` deve aceitar um payload contendo `title`, `content` e `permissions` (lista de userIds ou roles com acesso ao documento).

## RF02 — Publicação de Eventos

Ao criar ou atualizar um documento, o sistema deve publicar um evento `document.updated` em RabbitMQ contendo: `id`, `version`, `title`, `content`, `updatedAt` e `permissions` (ACLs). O evento deve ser publicado imediatamente após a persistência no banco relacional.

## RF03 — Indexação Assíncrona

O Indexer Service deve consumir eventos `document.updated`, realizar chunking do conteúdo (por parágrafo ou tamanho fixo) e gerar embeddings utilizando uma API de IA externa (ex.: OpenAI, Gemini). Cada chunk deve ser processado e enviado ao banco vetorial.

## RF04 — Armazenamento de Embeddings

Os embeddings gerados devem ser armazenados em um banco vetorial (Redis Vector Search ou Postgres pgvector). O índice deve permitir busca por similaridade vetorial (similarity search) para recuperar os trechos mais relevantes dado um vetor de consulta.

## RF05 — Busca Semântica

O Query Service deve receber uma pergunta via `POST /query` com `{ query, userId }`, gerar o embedding da query, executar similarity search no vector DB e retornar os trechos mais relevantes para o usuário.

## RF06 — Resposta com LLM (Futuro)

O Query Service deve integrar com um LLM para gerar uma resposta em linguagem natural baseada nos trechos recuperados. O usuário recebe uma resposta fluida em vez de apenas uma lista de trechos.
