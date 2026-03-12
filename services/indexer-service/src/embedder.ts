import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

export interface EmbeddingResult {
    chunkId: string;
    text: string;
    embedding: number[];
}

export async function generateEmbedding(text: string): Promise<number[]> {
    const result = await model.embedContent(text);
    return result.embedding.values;
}

export async function generateEmbeddings(
    chunks: Array<{ chunkId: string; text: string }>
): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];

    for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.text);
        results.push({
            chunkId: chunk.chunkId,
            text: chunk.text,
            embedding
        });

        console.log(`Generated embedding for chunk ${chunk.chunkId} (${chunk.text.length} chars)`);
    }

    return results;
}
