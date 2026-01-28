import { join } from 'node:path';
import winston from 'winston';
import config from './index';

// Create logs directory path
const logDir = join(process.cwd(), 'logs');

export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
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
              winston.format.simple(),
              winston.format.printf(
                (info) => `[${info.level}]: ${info.timestamp} ${info.message}`
              )
            ),
          }),
        ]
      : []),
  ],
});

export default logger;
