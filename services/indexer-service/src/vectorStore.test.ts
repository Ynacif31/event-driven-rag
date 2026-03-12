import 'dotenv/config';
import { connectRedis, upsertChunks, disconnectRedis } from './vectorStore.js';
import { generateEmbeddings } from './embedder.js';
import { chunkDocument } from './chunker.js';

async function test() {
  console.log('🧪 Testando Redis Vector Search...\n');

  await connectRedis();

  const chunks = chunkDocument('doc-test', 1, 'Event-driven architecture é um padrão de design onde componentes se comunicam via eventos. RabbitMQ é um message broker que implementa esse padrão. Redis é um banco de dados em memória muito rápido.');

  console.log(`📝 ${chunks.length} chunks gerados\n`);

  const embeddings = await generateEmbeddings(chunks);
  await upsertChunks(embeddings, 'doc-test', 1);

  console.log('\n✅ Chunks salvos no Redis com sucesso!');
  console.log('👉 Acesse localhost:8001 (RedisInsight) pra ver os dados');

  await disconnectRedis();
}

test().catch(console.error);
