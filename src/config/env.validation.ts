import { z } from 'zod';

// Environment variables validation schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default(3000),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Security - JWT
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT access secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT refresh secret must be at least 32 characters'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'), // 5-15 minutes
  JWT_REFRESH_EXPIRATION: z.string().default('7d'), // 7-30 days

  // Cookie settings
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
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
