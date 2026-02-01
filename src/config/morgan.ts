import fs from 'node:fs';
import path from 'node:path';
import type { Request, RequestHandler, Response } from 'express';
import morgan from 'morgan';
import config from '@/config/config';

// Custom token for error message
morgan.token('message', (_req: Request, res: Response) => {
  return (res.locals as { errorMessage?: string }).errorMessage || '';
});

let successHandler: RequestHandler;
let errorHandler: RequestHandler;

if (config.isDev) {
  // ===== DEVELOPMENT =====

  // Custom format function for dev logs
  const devFormat: morgan.FormatFn = (tokens, req, res) => {
    // call default 'dev' formatter and append error message if exists
    const expressRes = res as unknown as Response;
    const devFormatter = (morgan as unknown as Record<string, morgan.FormatFn>).dev;
    const baseLog = devFormatter ? devFormatter(tokens, req, res) : '';
    return (
      baseLog +
      (expressRes.locals?.errorMessage ? ` - error-message: ${expressRes.locals.errorMessage}` : '')
    );
  };

  successHandler = morgan(devFormat, {
    skip: (_req, res) => res.statusCode >= 400,
  });

  errorHandler = morgan(devFormat, {
    skip: (_req, res) => res.statusCode < 400,
  });
} else {
  // ===== PRODUCTION =====

  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '..', '..', 'logs', 'access.log'),
    { flags: 'a' }
  );

  const successResponseFormat =
    ':date[iso] :remote-addr - :method :url :status :res[content-length] - :response-time ms';

  successHandler = morgan(successResponseFormat, {
    stream: accessLogStream,
    skip: (_req, res) => res.statusCode >= 400,
  });

  const errorResponseFormat =
    ':date[iso] :remote-addr - :method :url :status :res[content-length] - :response-time ms - error-message: :message';

  errorHandler = morgan(errorResponseFormat, {
    stream: accessLogStream,
    skip: (_req, res) => res.statusCode < 400,
  });
}

export { successHandler, errorHandler };
