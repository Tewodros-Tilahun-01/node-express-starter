import { Router } from 'express';
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
router.use('/users', userRoutes);

export default router;
