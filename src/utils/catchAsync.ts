import type { NextFunction, Request, Response } from 'express';

/**
 * Type definition for async route handlers
 */
export type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Wrapper function to catch async errors in route handlers
 * Automatically forwards any thrown errors to the global error handler
 *
 * @param fn - The async route handler function
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * import { catchAsync } from '@/utils/catchAsync';
 *
 * const getUser = catchAsync(async (req, res, next) => {
 *   const user = await User.findById(req.params.id);
 *   if (!user) {
 *     throw AppError.notFound('User not found');
 *   }
 *   res.json({ success: true, data: user });
 * });
 * ```
 */
export const catchAsync = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
