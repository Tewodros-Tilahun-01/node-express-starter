import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const env: string = process.env.NODE_ENV || 'development';

interface Config {
  env: string;
  isDev: boolean;
  isTest: boolean;
  isProd: boolean;
  port: number;
  logLevel: string;
  secrets: {
    jwt: string | undefined;
    jwtExp: string;
  };
}

const baseConfig: Config = {
  env,
  isDev: env === 'development',
  isTest: env === 'test',
  isProd: env === 'production',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || (env === 'development' ? 'debug' : 'info'),
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: process.env.JWT_EXP || '7d',
  },
};

export default baseConfig;
