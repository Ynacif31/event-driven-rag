export interface Chunk {
    chunkId: string;
    docId: string;
    docVersion: number;
    index: number;
    text: string;
}

interface ChunkOptions {
    chunkSize?: number;
    overlap?: number;
}

export function chunkDocument(
    docId: string,
    docVersion: number,
    text: string,
    options: ChunkOptions = {}
): Chunk[] {
    const { chunkSize = 500, overlap = 50 } = options;
    const chunks: Chunk[] = [];
    let index = 0;
    let position = 0;

    while (position < text.length) {
        const end = Math.min(position + chunkSize, text.length);
        const chunkText = text.slice(position, end).trim();

        if (chunkText.length > 0) {
            chunks.push({
                chunkId: `${docId}-v${docVersion}-chunk-${index}`,
                docId,
                docVersion,
                index,
                text: chunkText
            });
            index++;
        }
        position += chunkSize - overlap;
    }

    return chunks;
}