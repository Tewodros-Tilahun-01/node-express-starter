import type { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import config from '../config';
import { logger } from '../config/logger';

// Create a stream object with a 'write' function that will be used by morgan
const stream = {
  write: (message: string) => {
    // Remove the newline character that morgan adds
    logger.info(message.trim());
  },
};

// Morgan middleware - use different formats for dev vs production
export const httpLogger = config.isDev
  ? morgan('dev') // Colorized output for development
  : morgan('combined', { stream }); // Log to winston in production

// Simple error logging middleware
export const errorLogger = (
  err: Error,
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  logger.error(`Error: ${err.message}`, {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });
  next(err);
};
