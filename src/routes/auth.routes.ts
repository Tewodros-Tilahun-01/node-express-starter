import { Router } from 'express';
import { authController } from '@/controllers';
import { authMiddleware, validateMiddleware } from '@/middlewares';
import * as authValidator from '@/validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  validateMiddleware.validate(authValidator.registerSchema),
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login with username/email and password
 * @access  Public
 */
router.post('/login', validateMiddleware.validate(authValidator.loginSchema), authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public (requires refresh token)
 */
router.post('/refresh', authMiddleware.authenticate, authController.refresh);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (revoke refresh token)
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   POST /api/v1/auth/logout-all
 * @desc    Logout from all devices (revoke all refresh tokens)
 * @access  Protected
 */
router.post('/logout-all', authMiddleware.authenticate, authController.logoutAll);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Protected
 */
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);

export default router;
