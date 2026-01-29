import compression from 'compression';
import cors from 'cors';
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import helmet from 'helmet';
import { errorHandler, successHandler } from '@/config/morgan';
import { errorConverter, globalErrorHandler } from '@/middlewares/error';
import { AppError } from '@/utils/AppError';

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
app.use((req: Request, _res: Response, next: NextFunction) => {
  const err = AppError.notFound(`Route ${req.originalUrl} not found`);
  next(err);
});

// Error converter middleware
app.use(errorConverter);

// Global error handler
app.use(globalErrorHandler);

export default app;
