import app from '@/app';
import config from '@/config/config';
import { logger } from '@/config/logger';
import { connectDatabase } from './config/prisma';

const PORT: number = config.port || 5000;

// Startup function
const _startServer = async (): Promise<void> => {
  await connectDatabase();
  // Start the server
  app.listen(PORT, (): void => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught exception:', error.message);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown) => {
    logger.error(
      'Unhandled promise rejection:',
      reason instanceof Error ? reason.message : String(reason)
    );
    process.exit(1);
  });
};
// Start the server
_startServer();
