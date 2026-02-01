import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import config from './config';
import { logger } from './logger';

declare global {
  var __globalPrisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalThis.__globalPrisma ??
  new PrismaClient({
    adapter,
    log: config.isDev ? ['info', 'warn', 'error'] : ['error'],
  });

// Simple connection test
export const connectDatabase = async (): Promise<void> => {
  try {
    const _result = await prisma.$queryRaw`SELECT 1 as connected`;
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed');
    if (error instanceof Error) {
      logger.error('Error message:', error.message);
    }
  }
};

if (!config.isProd) {
  globalThis.__globalPrisma = prisma;
}
