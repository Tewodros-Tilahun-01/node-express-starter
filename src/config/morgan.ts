import fs from 'node:fs';
import path from 'node:path';
import type { Request, RequestHandler, Response } from 'express';
import morgan from 'morgan';
import config from '@/config';

// Custom token (used only in prod)
morgan.token('message', (_req: Request, res: Response) => {
  return (res.locals as { errorMessage?: string }).errorMessage || '';
});

let successHandler: RequestHandler;
let errorHandler: RequestHandler;

if (config.isDev) {
  // ===== DEVELOPMENT =====
  successHandler = morgan('dev', {
    skip: (_req: Request, res: Response) => res.statusCode >= 400,
  });

  errorHandler = morgan('dev', {
    skip: (_req: Request, res: Response) => res.statusCode < 400,
  });
} else {
  // ===== PRODUCTION =====

  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '..', '..', 'logs', 'access.log'),
    { flags: 'a' }
  );

  // Success logs (2xx–3xx)
  const successResponseFormat =
    ':date[iso] :remote-addr - :method :url :status :res[content-length] - :response-time ms';

  successHandler = morgan(successResponseFormat, {
    stream: accessLogStream,
    skip: (_req: Request, res: Response) => res.statusCode >= 400,
  });

  // Error logs (4xx–5xx)
  const errorResponseFormat =
    ':date[iso] :remote-addr - :method :url :status :res[content-length] - :response-time ms  - error-message: :message';

  errorHandler = morgan(errorResponseFormat, {
    stream: accessLogStream,
    skip: (_req: Request, res: Response) => res.statusCode < 400,
  });
}

export { successHandler, errorHandler };
