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
  database: {
    url: string;
  };
  secrets: {
    jwt: string;
    jwtExp: string;
  };
}

const baseConfig: Config = {
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  isProd: env.NODE_ENV === 'production',
  port: env.PORT,
  logLevel: env.LOG_LEVEL,
  database: {
    url: env.DATABASE_URL,
  },
  secrets: {
    jwt: env.JWT_SECRET,
    jwtExp: env.JWT_EXP,
  },
};

export default baseConfig;
