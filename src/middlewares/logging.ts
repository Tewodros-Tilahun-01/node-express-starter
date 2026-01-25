import type { NextFunction, Request, Response } from 'express';
import pinoHttp from 'pino-http';
import { logger } from '../utils/logger';

// Extend Express Request type to include logger
declare global {
  namespace Express {
    interface Request {
      log: typeof logger;
    }
  }
}

// Simple HTTP logging middleware
export const httpLogger = pinoHttp({
  // biome-ignore lint/suspicious/noExplicitAny: <>
  logger: logger as any, // Type assertion to fix pino-http compatibility
  customLogLevel: (_req: Request, res: Response, err?: Error): string => {
    if (err || res.statusCode >= 500) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
});

// Simple error logging middleware
export const errorLogger = (
  err: Error,
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  req.log.error({ err }, `Error: ${err.message}`);
  next(err);
};
