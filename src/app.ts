import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import helmet from 'helmet';
import { errorHandler, successHandler } from '@/config/morgan';
import passport from '@/config/passport';
import { errorMiddleware } from '@/middlewares';
import routes from '@/routes/index.routes';
import { AppError } from '@/utils/AppError';

const app: Application = express();

// HTTP request logging middleware - success and error handlers
app.use(successHandler);
app.use(errorHandler);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: true, // Configure based on your needs
    credentials: true, // Allow cookies
  })
);
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  const err = AppError.notFound(`Route ${req.originalUrl} not found`);
  next(err);
});

// Error converter middleware
app.use(errorMiddleware.errorConverter);

// Global error handler
app.use(errorMiddleware.globalErrorHandler);

export default app;
