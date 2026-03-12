import 'dotenv/config';
import { generateEmbedding } from './embedder.js';

async function test() {
  console.log('🧪 Testando Gemini embeddings...');

  const texto = 'Event-driven architecture com RabbitMQ e Redis';
  const embedding = await generateEmbedding(texto);

  console.log(`✅ Embedding gerado com ${embedding.length} dimensões`);
  console.log(`📊 Primeiros 5 valores: [${embedding.slice(0, 5).join(', ')}]`);
}

test().catch(console.error);
