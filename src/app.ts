import compression from 'compression';
import cors from 'cors';
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import helmet from 'helmet';
import config from '@/config';
import { errorHandler, successHandler } from '@/config/morgan';
import { errorLogger } from '@/middlewares/error';

const app: Application = express();

// HTTP request logging middleware - success and error handlers
app.use(successHandler);
app.use(errorHandler);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error logging middleware
app.use(errorLogger);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _nextt: NextFunction) => {
  const statusCode = (err as Error & { statusCode?: number }).statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: config.isProd ? 'Internal server error' : err.message,
  });
});

export default app;
