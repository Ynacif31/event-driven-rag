import { chunkDocument } from './chunker';

const texto = 'a'.repeat(1200); // 1200 chars
const chunks = chunkDocument('doc-1', 1, texto);

console.log(`Total chunks: ${chunks.length}`);
console.log(`Chunk 0 size: ${chunks[0].text.length}`);
console.log(`Chunk 1 size: ${chunks[1].text.length}`);
console.log('✅ Chunking funcionando!');
