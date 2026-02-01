import type { NextFunction, Request, Response } from 'express';
import passport from '@/config/passport';
import { AppError } from '@/utils/AppError';

/**
 * Middleware to protect routes - requires valid JWT access token
 * Token can be in cookie (primary) or Authorization header (fallback)
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: Express.User) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    req.user = user;
    next();
  })(req, res, next);
};
