import { createClient } from 'redis';
import { EMBEDDING_DIMENSIONS } from './embedder.js';
import type { EmbeddingResult } from './embedder.js';

type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient;

export async function connectRedis(): Promise<void> {
    client = createClient({
        url: process.env.REDIS_URL
        ?? 'redis://localhost:6379',
    });

    await client.connect();
    console.log('Redis connected');

    await ensureIndex();
}

async function ensureIndex(): Promise<void> {
    try {
        await client.ft.info('idx:chunks');
        console.log('Index idx:chunks already exists');
    } catch (error) {
        await client.ft.create(
            'idx:chunks',
            {
              docId:     { type: 'TEXT' as any },
              text:      { type: 'TEXT' as any },
              version:   { type: 'NUMERIC' as any },
              embedding: {
                type: 'VECTOR' as any,
                ALGORITHM: 'HNSW' as any,
                TYPE: 'FLOAT32' as any,
                DIM: EMBEDDING_DIMENSIONS,
                DISTANCE_METRIC: 'COSINE' as any,
              },
            },
            { ON: 'HASH', PREFIX: 'chunk:' }
          );
          console.log(`Index idx:chunks (${EMBEDDING_DIMENSIONS} dims) created`);
    }
}

export async function upsertChunks(
    embeddings: EmbeddingResult[],
    docId: string,
    docVersion: number
): Promise<void> {
    for (const { chunkId, text, embedding} of embeddings) {
        const key = `chunk:${chunkId}`;

        const float32Buffer = Buffer.from(new Float32Array(embedding).buffer);
        
        await client.hSet(key, {
            docId,
            text,
            version: docVersion,
            embedding: float32Buffer,
        });

        console.log(`Upserted chunk ${chunkId} for doc ${docId} version ${docVersion}`);
    }
}

export async function disconnectRedis(): Promise<void> {
    await client?.disconnect();
    console.log('Redis disconnected');
}