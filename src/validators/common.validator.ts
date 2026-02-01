import { z } from 'zod';

// Common validation schemas that can be reused across the application

// Pagination schema
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
});

// Search schema
export const searchSchema = z.object({
  search: z.string().min(1).optional(),
});

// ID parameter schema
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid ID format').transform(Number),
});

// Date range schema
export const dateRangeSchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

// Sort schema
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Combined query schema for list endpoints
export const listQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10).optional(),
  search: z.string().min(1).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
});

// Email validation
export const emailSchema = z
  .string()
  .includes('@')
  .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Invalid email format');

// Password validation (for future auth implementation)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  );

// Type exports
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SearchQuery = z.infer<typeof searchSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type DateRangeQuery = z.infer<typeof dateRangeSchema>;
export type SortQuery = z.infer<typeof sortSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
