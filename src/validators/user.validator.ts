import { z } from 'zod';

// Base user schema matching Prisma model exactly
export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z
    .string()
    .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Invalid email format'),
  name: z.string(),
});

// Create user schema (without id)
export const createUserSchema = z.object({
  email: z
    .string()
    .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Invalid email format'),
  username: z.string().min(3).max(30),
  name: z.string(),
  password: z.string().min(8),
  avatar: z.string(),
});

// Update user schema (all fields optional)
export const updateUserSchema = z.object({
  email: z
    .string()
    .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Invalid email format')
    .optional(),
  username: z.string().min(3).max(30).optional(),
  name: z.string().optional(),
  password: z.string().min(8).optional(),
});

// Query parameters schema for listing users
export const getUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).default('1').optional().transform(Number),
  limit: z.string().regex(/^\d+$/).default('10').optional().transform(Number),
  search: z.string().optional().default(''),
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
