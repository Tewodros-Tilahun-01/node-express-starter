import { z } from 'zod';

/**
 * Register validation schema
 */
export const registerSchema = {
  body: z
    .object({
      email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
      passwordConfirmation: z
        .string()
        .min(1, 'Password confirmation is required'),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
};

/**
 * Login validation schema
 * Accepts either username or email as identifier
 */
export const loginSchema = {
  body: z.object({
    identifier: z.string().min(3, 'Username or email is required').trim(),
    password: z.string().min(1, 'Password is required'),
  }),
};

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().optional(), // Optional because it can come from cookie
  }),
};

// Export types
export type RegisterInput = z.infer<typeof registerSchema.body>;
export type LoginInput = z.infer<typeof loginSchema.body>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema.body>;
