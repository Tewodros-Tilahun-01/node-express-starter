import { z } from 'zod';

// Environment variables validation schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default(5000),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Database
  DATABASE_URL: z.string().url('Invalid database URL'),

  // Security
  JWT_SECRET: z.string().min(10, 'JWT secret must be at least 10 characters'),
  JWT_EXP: z.string().default('7d'),
});

/**
 * Validate environment variables on application startup
 */
export const validateEnv = () => {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
    }
    throw error;
  }
};

// Type for validated environment variables
export type ValidatedEnv = z.infer<typeof envSchema>;
