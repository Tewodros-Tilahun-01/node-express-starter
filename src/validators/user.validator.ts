import { z } from 'zod';

// Base user schema matching Prisma model exactly
export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z
    .string()
    .refine(
      (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      'Invalid email format'
    ),
  name: z.string().nullable(),
});

// Create user schema (without id, name is optional)
export const createUserSchema = z.object({
  email: z
    .string()
    .refine(
      (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      'Invalid email format'
    ),
  name: z.string().optional(),
});

// Update user schema (all fields optional)
export const updateUserSchema = z.object({
  email: z
    .string()
    .refine(
      (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      'Invalid email format'
    )
    .optional(),
  name: z.string().optional(),
});

// Query parameters schema for listing users
export const getUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
  search: z.string().optional(),
});

// Path parameters schema
export const userParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid user ID').transform(Number),
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
