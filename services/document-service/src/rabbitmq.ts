import amqp from 'amqplib';
import { DocumentUpdatedEvent } from './types.js';

export class RabbitMQPublisher {
    private connection: amqp.ChannelModel | null = null;
    private channel: amqp.Channel | null = null;

    async connect(): Promise<void> {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL ?? 'amqp://localhost');
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange('document.events', 'topic', { durable: true });
        console.log('RabbitMQ connected');
    }

    async publishDocumentUpdated(event: DocumentUpdatedEvent): Promise<void> {
        if (!this.channel) throw new Error('RabbitMQ channel not connected');

        const message = JSON.stringify(event);
        const ok = await this.channel.publish(
            'document.events',
            'document.updated',
            Buffer.from(message),
            { persistent: true }
        );

        if (ok) {
            console.log(`Event ${event.eventType} published to RabbitMQ`);
        } else {
            console.error(`Failed to publish event ${event.eventType} to RabbitMQ`);
        }
    }

    async close(): Promise<void> {
        await this.channel?.close();
        await this.connection?.close();
        console.log('RabbitMQ disconnected');
    }
}