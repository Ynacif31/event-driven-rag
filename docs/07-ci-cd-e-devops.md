# 7. CI/CD e DevOps

## Visão Geral

O pipeline de CI/CD visa automatizar build, testes e deploy dos serviços Node+TypeScript, garantindo qualidade e consistência antes de cada release.

---

## Fase 1 — CI (Imediato)

### GitHub Actions — `ci.yml`

**Trigger:** Push e pull request na branch `main`.

**Etapos:**

1. **Checkout** — Código do repositório.
2. **Setup Node.js** — Versão LTS (ex.: 20.x).
3. **Cache** — `npm` ou `pnpm` para acelerar instalação.
4. **Install** — `npm ci` em cada serviço (`document-service`, `indexer-service`, `query-service`).
5. **Lint** — `npm run lint` (ESLint).
6. **Type-check** — `npm run type-check` ou `tsc --noEmit`.
7. **Test** — `npm test` (Jest ou Vitest).
8. **Build** — `npm run build` para validar compilação.

### Estrutura sugerida

```
.github/
  workflows/
    ci.yml
```

---

## Fase 2 — Docker Build (Próximo)

- Build de imagens Docker para cada serviço.
- Publicação em registry (Docker Hub, GitHub Container Registry ou ECR).
- Integração com `docker-compose` para ambiente local e staging.

---

## Fase 3 — Deploy (Futuro)

- Deploy em ambiente cloud (ex.: AWS ECS, GCP Cloud Run, Kubernetes).
- Secrets para API keys (OpenAI, etc.) e connection strings.
- Health checks e métricas.

---

## Variáveis de Ambiente

| Variável           | Serviço(s)      | Descrição                    |
|--------------------|-----------------|------------------------------|
| `RABBITMQ_URL`     | Document, Indexer| Connection string RabbitMQ   |
| `DATABASE_URL`     | Document        | Postgres connection          |
| `VECTOR_DB_URL`   | Indexer, Query  | Redis ou Postgres+pgvector   |
| `OPENAI_API_KEY`  | Indexer, Query  | API key para embeddings/LLM  |

---

## Decisões Pendentes

- Escolher **um** vector store para v1: Redis Vector Search vs Postgres+pgvector.
- Definir provedor de IA: OpenAI, Gemini ou outro.
- Definir estratégia de deploy (container, serverless, etc.).
