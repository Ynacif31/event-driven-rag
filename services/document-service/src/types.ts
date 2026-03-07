export interface Document {
    id: string;
    version: number;
    title: string;
    content: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface DocumentUpdatedEvent {
    eventType: 'document.updated';
    eventId: string;
    correlationId: string;
    sourceService: 'document-service';
    data: Document;
    timestamp: Date;
}