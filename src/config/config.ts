import dotenv from 'dotenv';
import { validateEnv } from './env.validation';

dotenv.config({ quiet: true });

// Validate environment variables on startup
const env = validateEnv();

interface Config {
  env: string;
  isDev: boolean;
  isTest: boolean;
  isProd: boolean;
  port: number;
  logLevel: string;
  secrets: {
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    jwtAccessExpiration: string;
    jwtRefreshExpiration: string;
  };
  cookie: {
    domain?: string;
    secure: boolean;
    accessTokenMaxAge: number;
    refreshTokenMaxAge: number;
  };
}

const baseConfig: Config = {
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  isProd: env.NODE_ENV === 'production',
  port: env.PORT,
  logLevel: env.LOG_LEVEL,
  secrets: {
    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    jwtAccessExpiration: env.JWT_ACCESS_EXPIRATION,
    jwtRefreshExpiration: env.JWT_REFRESH_EXPIRATION,
  },
  cookie: {
    domain: env.COOKIE_DOMAIN,
    secure: env.COOKIE_SECURE,
    accessTokenMaxAge: env.COOKIE_ACCESS_TOKEN_MAX_AGE,
    refreshTokenMaxAge: env.COOKIE_REFRESH_TOKEN_MAX_AGE,
  },
};

export default baseConfig;
