import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '@/config';
import { logger } from '@/config/logger';
import { AppError } from '@/utils/AppError';

/**
 * Error converter middleware
 * Converts non-AppError instances to AppError
 */
export const errorConverter = (
  err: Error & { statusCode?: number },
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof AppError)) {
    const statusCode =
      error.statusCode || error instanceof Prisma.PrismaClientKnownRequestError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Bad Request';
    error = new AppError(statusCode, message, false, error.stack);
  }

  next(error);
};

/**
 * Global error handler middleware
 * Formats and sends consistent error responses
 */
export const globalErrorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let { statusCode, message } = err;

  if (config.isProd && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  const response = {
    error: true,
    code: statusCode,
    message,
    ...(config.isDev && { stack: err.stack }),
  };

  res.locals.errorMessage = message;

  if (config.isDev) {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
