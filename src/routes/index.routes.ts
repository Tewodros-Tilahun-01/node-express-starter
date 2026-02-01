import { Router } from 'express';
import { authMiddleware } from '@/middlewares';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

// Simple health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'API',
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', authMiddleware.authenticate, userRoutes);

export default router;
