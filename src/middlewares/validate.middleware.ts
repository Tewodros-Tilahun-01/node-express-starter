import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';
import { AppError } from '@/utils/AppError';

// Extend Request interface to include validated data
declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}

/**
 * Validation middleware factory for Zod schemas
 */
export const validate = (schemas: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Validate request body
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          const errors = result.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          throw AppError.badRequest(
            `Validation error: ${errors.map((e) => e.message).join(', ')}`
          );
        }
        req.validatedBody = result.data;
      }

      // Validate query parameters
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          const errors = result.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          throw AppError.badRequest(
            `Query validation error: ${errors.map((e) => e.message).join(', ')}`
          );
        }
        req.validatedQuery = result.data;
      }

      // Validate path parameters
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          const errors = result.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          throw AppError.badRequest(
            `Parameter validation error: ${errors.map((e) => e.message).join(', ')}`
          );
        }
        req.validatedParams = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Generic validation function for any Zod schema
 */
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw AppError.badRequest(
      `Validation error: ${errors.map((e) => e.message).join(', ')}`
    );
  }
  return result.data;
};
