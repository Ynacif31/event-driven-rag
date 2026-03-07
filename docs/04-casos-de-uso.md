# 4. Casos de Uso

## UC01 — Criar Documento

**Ator:** Usuário autenticado (via API)

**Pré-condições:** Usuário possui credenciais válidas.

**Fluxo principal:**
1. Usuário envia `POST /documents` com `title`, `content` e `permissions`.
2. Document Service valida o payload e persiste o documento no banco relacional.
3. Document Service publica evento `document.updated` em RabbitMQ.
4. API retorna 201 com o documento criado (id, version, etc.).
5. Indexer Service consome o evento, faz chunking, gera embeddings e grava no Vector DB (assíncrono).

**Fluxo alternativo:** Validação falha → 400 com mensagem de erro.

**Pós-condições:** Documento persistido; evento publicado; índice vetorial atualizado em background.

---

## UC02 — Atualizar Documento

**Ator:** Usuário autenticado (via API)

**Pré-condições:** Documento existe e usuário tem permissão de edição.

**Fluxo principal:**
1. Usuário envia `PUT /documents/:id` com `title`, `content` e/ou `permissions`.
2. Document Service valida, atualiza versão e persiste no banco.
3. Document Service publica evento `document.updated` com nova versão.
4. API retorna 200 com documento atualizado.
5. Indexer Service reprocessa o documento e atualiza embeddings (idempotente).

**Fluxo alternativo:** Documento não encontrado → 404.

**Pós-condições:** Documento atualizado; índice vetorial reflete a nova versão.

---

## UC03 — Consultar Documentos (Busca Semântica)

**Ator:** Usuário autenticado (via API)

**Pré-condições:** Índice vetorial contém embeddings de pelo menos um documento.

**Fluxo principal:**
1. Usuário envia `POST /query` com `{ query, userId }`.
2. Query Service gera embedding da query.
3. Query Service executa similarity search no Vector DB.
4. Query Service filtra resultados por permissões (ACLs) do usuário.
5. API retorna trechos mais relevantes ordenados por score.

**Fluxo alternativo:** Nenhum trecho encontrado → lista vazia.

**Pós-condições:** Usuário recebe trechos relevantes para a pergunta.

---

## UC04 — Obter Resposta com LLM (Futuro)

**Ator:** Usuário autenticado (via API)

**Pré-condições:** UC03 implementado; integração com LLM configurada.

**Fluxo principal:**
1. Usuário envia `POST /query` com `{ query, userId }`.
2. Query Service executa UC03 (similarity search).
3. Query Service monta prompt com trechos recuperados e envia ao LLM.
4. LLM gera resposta em linguagem natural.
5. API retorna resposta fluida ao usuário.

**Pós-condições:** Usuário recebe resposta contextualizada em linguagem natural.
