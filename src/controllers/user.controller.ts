import type { Request, Response } from 'express';
import * as userService from '@/services/user.service';
import { catchAsync } from '@/utils/catchAsync';
import {
  sendPaginatedResponse,
  sendSuccess,
  sendSuccessMessage,
} from '@/utils/response';
import type {
  CreateUserInput,
  GetUsersQuery,
  UpdateUserInput,
  UserParams,
} from '@/validators/user.validator';

/**
 * Get all users with pagination and search
 */
export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as GetUsersQuery;
  const result = await userService.getUsers(query);

  sendPaginatedResponse(
    res,
    result.users,
    result.pagination,
    'Users retrieved successfully'
  );
});

/**
 * Get user by ID
 */
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as UserParams;
  const user = await userService.getUserById(id);

  sendSuccess(res, user, 'User retrieved successfully');
});

/**
 * Create new user
 */
export const createUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body as CreateUserInput;
  const user = await userService.createUser(userData);

  sendSuccess(res, user, 'User created successfully', 201);
});

/**
 * Update user by ID
 */
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as UserParams;
  const userData = req.body as UpdateUserInput;
  const user = await userService.updateUser(id, userData);

  sendSuccess(res, user, 'User updated successfully  ');
});

/**
 * Delete user by ID
 */
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as UserParams;
  await userService.deleteUser(id);

  sendSuccessMessage(res, 'User deleted successfully');
});
