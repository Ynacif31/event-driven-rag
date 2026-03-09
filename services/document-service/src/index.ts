import { app, logger, rabbitPublisher } from './app.js';

const PORT = 3001;

function bootstrap(): void {
    app.listen(PORT, async () => {
        try {
            await rabbitPublisher.connect();
            logger.info(`Document service listening on port ${PORT}`);
        } catch (error) {
            logger.error(`Error starting document service: ${error}`);
            process.exit(1);
        }
    });
}

bootstrap();

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down...');
    await rabbitPublisher.close();
    process.exit(0);
});

