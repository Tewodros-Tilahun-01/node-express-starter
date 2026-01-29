import { PrismaClient } from '../generated/prisma/client';
import config from './index';

declare global {
  var __globalPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__globalPrisma ??
  new PrismaClient({
    accelerateUrl: config.database.url,
    log: config.isDev ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  });

if (!config.isProd) {
  globalThis.__globalPrisma = prisma;
}
