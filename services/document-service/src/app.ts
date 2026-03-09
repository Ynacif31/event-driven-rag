import express, { Request, Response } from 'express';
import cors from 'cors';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentUpdatedEvent } from './types.js';
import { RabbitMQPublisher } from './rabbitmq.js';


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [new winston.transports.Console()]
});

const rabbitPublisher = new RabbitMQPublisher();
const documents: Map<string, Document> = new Map();

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/documents', async (req: Request, res: Response) => {
  const correlationId = uuidv4();
  const doc: Document = {
    id: uuidv4(),
    version: 1,
    title: req.body.title,
    content: req.body.content,
    permissions: req.body.permissions || [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  try {
    documents.set(doc.id, doc);

    const event: DocumentUpdatedEvent = {
        eventType: 'document.updated',
        eventId: uuidv4(),
        correlationId,
        sourceService: 'document-service',
        data: doc,
        timestamp: new Date()
    };

    await rabbitPublisher.publishDocumentUpdated(event);
    logger.info(`Document ${doc.id} created with version ${doc.version}`);
    res.status(201).json({ id: doc.id, version: doc.version });
  } catch (error) {
    logger.error(`Error creating document ${doc.id}: ${error}`);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

export { app, logger, rabbitPublisher };