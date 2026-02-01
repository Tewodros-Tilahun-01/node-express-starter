import { join } from 'node:path';
import winston from 'winston';
import config from '@/config/config';

// Create logs directory path
const logDir = join(process.cwd(), 'logs');

export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Always log errors to file
    new winston.transports.File({
      filename: join(logDir, 'error.log'),
      level: 'error',
    }),
    // Log all levels to combined file in production
    ...(config.isDev
      ? []
      : [
          new winston.transports.File({
            filename: join(logDir, 'combined.log'),
          }),
        ]),
    // Console transport for development
    ...(config.isDev
      ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp({
                format: 'HH:mm:ss',
              }),
              winston.format.colorize(),
              winston.format.printf(
                (info) =>
                  `[${info.level}]: ${info.timestamp} ${info.stack || info.message} `
              )
            ),
          }),
        ]
      : []),
  ],
});

export default logger;
