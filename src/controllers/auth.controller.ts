import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '@/config/config';
import passport from '@/config/passport';
import { authService } from '@/services';
import { AppError } from '@/utils/AppError';
import type { LoginInput, RegisterInput } from '@/validators';

/**
 * Cookie configuration for tokens
 */
const getAccessTokenCookieOptions = () => ({
  httpOnly: true, // Prevents XSS attacks
  secure: config.isProd || config.cookie.secure, // HTTPS only in production
  sameSite: 'strict' as const, // CSRF protection
  maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  domain: config.cookie.domain,
});

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true, // Prevents XSS attacks
  secure: config.isProd || config.cookie.secure, // HTTPS only in production
  sameSite: 'strict' as const, // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  domain: config.cookie.domain,
  path: '/api/v1/auth/refresh', // Only sent to refresh endpoint
});

/**
 * Register new user
 * POST /api/v1/auth/register
 */
export const register = async (
  req: Request<object, object, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user with username/email and password
 * POST /api/v1/auth/login
 */
export const login = async (
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'local',
    { session: false },
    async (err: Error | null, user: Express.User | false) => {
      try {
        if (err) {
          return next(err);
        }

        if (!user) {
          return next(AppError.unauthorized('Invalid credentials'));
        }

        // Generate token pair
        const { accessToken, refreshToken } =
          await authService.generateTokenPair({
            id: user.id,
            email: user.email,
            username: user.username,
          });

        // Set tokens in HTTP-only cookies
        res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
        res.cookie(
          'refreshToken',
          refreshToken,
          getRefreshTokenCookieOptions()
        );

        res.status(httpStatus.OK).json({
          success: true,
          message: 'Login successful',
          data: {
            user,
            // Also return tokens for stateless API clients
            accessToken,
            refreshToken,
          },
        });
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

/**
 * Refresh access token using refresh token
 * POST /api/v1/auth/refresh
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      throw AppError.unauthorized('Refresh token required');
    }

    // Rotate refresh token (revoke old, issue new)
    const { tokens, user } = await authService.rotateRefreshToken(refreshToken);

    // Set new tokens in cookies
    res.cookie(
      'accessToken',
      tokens.accessToken,
      getAccessTokenCookieOptions()
    );
    res.cookie(
      'refreshToken',
      tokens.refreshToken,
      getRefreshTokenCookieOptions()
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        // Also return tokens for stateless API clients
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user - revoke refresh token
 * POST /api/v1/auth/logout
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
      // Revoke the refresh token
      await authService.revokeRefreshToken(refreshToken);
    }

    // Clear cookies
    res.clearCookie('accessToken', getAccessTokenCookieOptions());
    res.clearCookie('refreshToken', getRefreshTokenCookieOptions());

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout from all devices - revoke all user's refresh tokens
 * POST /api/v1/auth/logout-all
 */
export const logoutAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }

    // Revoke all refresh tokens for this user
    await authService.revokeAllUserTokens(req.user.id);

    // Clear cookies
    res.clearCookie('accessToken', getAccessTokenCookieOptions());
    res.clearCookie('refreshToken', getRefreshTokenCookieOptions());

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Logged out from all devices',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 * GET /api/v1/auth/me
 */
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }

    res.status(httpStatus.OK).json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};
