import app from './app';
import config from './config';
import { logger } from './config/logger';

const PORT: number = config.port || 3000;

// Start the server
app.listen(PORT, (): void => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (_error: Error) => {
  logger.error('Uncaught exception occurred');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (_reason: unknown) => {
  logger.error('Unhandled promise rejection occurred');
  process.exit(1);
});
