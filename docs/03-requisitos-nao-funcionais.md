# 3. Requisitos Não Funcionais

## RNF01 — Assincronia da Indexação

A criação e edição de documentos devem ser assíncronas em relação à indexação. A API de documentos deve responder imediatamente após persistir e publicar o evento, sem esperar a geração de embeddings. O usuário não deve perceber latência do processamento de IA.

## RNF02 — Idempotência do Pipeline

O pipeline de indexação deve ser idempotente. Reprocessar o mesmo evento (ex.: por retry ou replay) não pode gerar duplicações no índice vetorial. O upsert deve usar uma chave composta por `documentId` + `chunkIndex` (ou equivalente) para garantir substituição em vez de inserção duplicada.

## RNF03 — Rastreabilidade de Eventos

Todos os eventos devem registrar `correlationId` baseado em `documentId` + `version`, além de `sourceService` e `eventId`. Isso permite rastrear o fluxo de um documento através dos serviços e facilitar debugging e auditoria.

## RNF04 — Pipeline de CI

A solução deve possuir pipeline de CI para rodar testes e build em cada push na branch principal. O pipeline deve incluir: lint, type-check, testes unitários e build dos serviços Node+TypeScript.
