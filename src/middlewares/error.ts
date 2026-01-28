import type { NextFunction, Request, Response } from 'express';
import { logger } from '@/config/logger';

// Simple error logging middleware (uses Winston)
export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set error message for Morgan token
  res.locals.errorMessage = err.message;

  logger.error(`Error: ${err.message}`, {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });
  next(err);
};
