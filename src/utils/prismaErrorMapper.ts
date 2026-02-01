import httpStatus from 'http-status';
import { Prisma } from '../generated/prisma/client';
import { AppError } from './AppError';

/**
 * Maps Prisma errors to AppError instances with appropriate status codes and messages
 * @param error - The error to map
 * @returns AppError instance with appropriate status code and message
 */
export const prismaErrorMapper = (error: unknown): AppError => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint failed
        return new AppError(httpStatus.CONFLICT, 'Duplicate field value');

      case 'P2025':
        // Record not found
        return new AppError(httpStatus.NOT_FOUND, 'Resource not found');

      case 'P2003':
        // Foreign key constraint failed
        return new AppError(httpStatus.BAD_REQUEST, 'Invalid relation reference');

      case 'P2014':
        // Required relation missing
        return new AppError(httpStatus.BAD_REQUEST, 'Required relation is missing');

      case 'P2021':
        // Table does not exist
        return new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Database table does not exist');

      case 'P2022':
        // Column does not exist
        return new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Database column does not exist');

      default:
        return new AppError(httpStatus.BAD_REQUEST, `Database error: ${error.message}`);
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Unknown database error');
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Database engine error');
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Database connection error');
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError(httpStatus.BAD_REQUEST, 'Invalid query parameters');
  }

  // If it's not a Prisma error, return a generic server error
  return new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
};
