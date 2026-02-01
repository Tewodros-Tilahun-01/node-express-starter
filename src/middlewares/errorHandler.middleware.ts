import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '@/config/config';
import { logger } from '@/config/logger';
import { AppError } from '@/utils/AppError';
import { prismaErrorMapper } from '@/utils/prismaErrorMapper';
import { Prisma } from '../generated/prisma/client';

/**
 * Check if error is a Prisma client error
 */
const isPrismaError = (error: unknown): boolean => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  );
};

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
    // Check if it's a Prisma error and use the mapper
    if (isPrismaError(error)) {
      error = prismaErrorMapper(error);
    } else {
      // Handle other errors
      const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Internal Server Error';
      const isOperational = !!error.statusCode; // Operational if it has an explicit status code
      error = new AppError(statusCode, message, isOperational, error.stack);
    }
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
