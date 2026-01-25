import app from './app';
import config from './config';
import { logger } from './utils/logger';

const PORT: number = config.port || 3000;

// Start the server
app.listen(PORT, (): void => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.fatal({ err: error }, 'Uncaught exception occurred');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal({ reason }, 'Unhandled promise rejection occurred');
  process.exit(1);
});
