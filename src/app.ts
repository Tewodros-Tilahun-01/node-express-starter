import compression from 'compression';
import cors from 'cors';
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import helmet from 'helmet';
import { errorLogger, httpLogger } from './middlewares/logging';

const app: Application = express();

// HTTP request logging middleware
app.use(httpLogger);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Sample route with logging
app.get('/', (req: Request, res: Response) => {
  req.log.info('Home route accessed');
  res.json({
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
  });
});

// Sample error route for testing
app.get('/error', (_req: Request, _ress: Response, next: NextFunction) => {
  const error = new Error('This is a test error');
  next(error);
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
  const statusCode = (err as any).statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

export default app;
