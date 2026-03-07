# 5. Eventos e Modelo de Mensagens

## Exchange e Filas (RabbitMQ)

- **Exchange:** `document.events`
- **Queue:** `document-updated` (binding para eventos de criação/atualização)

---

## Evento: `document.updated`

**Quando:** Criação ou edição de documento.

**Payload:**

| Campo        | Tipo     | Descrição                                      |
|--------------|----------|------------------------------------------------|
| `id`         | `string` | ID único do documento                          |
| `version`    | `number` | Versão do documento (incrementa a cada edição) |
| `title`      | `string` | Título do documento                            |
| `content`    | `string` | Conteúdo completo em texto                     |
| `updatedAt` | `string` | ISO 8601 timestamp da última atualização       |
| `permissions`| `array`  | Lista de `userId` ou `role` com acesso (ACLs)  |

**Metadados (headers):**

| Campo           | Tipo     | Descrição                                      |
|-----------------|----------|------------------------------------------------|
| `correlationId` | `string` | `documentId` + `version` para rastreamento     |
| `sourceService` | `string` | Ex.: `document-service`                        |
| `eventId`       | `string` | UUID único do evento                           |

**Exemplo de payload:**

```json
{
  "id": "doc-123",
  "version": 2,
  "title": "Política de Remuneração",
  "content": "Este documento descreve os critérios de salário...",
  "updatedAt": "2025-03-07T14:30:00.000Z",
  "permissions": ["user-1", "role-hr"]
}
```

---

## Evento: `embedding.indexed` (Futuro)

**Quando:** Embeddings de um documento foram atualizados com sucesso.

**Payload (sugestão):**

| Campo        | Tipo     | Descrição                    |
|--------------|----------|------------------------------|
| `documentId` | `string` | ID do documento              |
| `version`    | `number` | Versão indexada              |
| `chunkCount` | `number` | Quantidade de chunks indexados|
| `indexedAt`  | `string` | ISO 8601 timestamp           |

**Uso:** Permite que outros serviços (ex.: Query Service) saibam quando um documento está disponível para busca, ou para métricas e auditoria.
