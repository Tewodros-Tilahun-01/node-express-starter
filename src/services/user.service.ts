import { prisma } from '@/config/prisma';
import { AppError } from '@/utils/AppError';
import type { CreateUserInput, GetUsersQuery, UpdateUserInput } from '@/validators/user.validator';

/**
 * Get all users with pagination and search
 */
export const getUsers = async (query: GetUsersQuery) => {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  // Build where clause for search
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { username: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // Get users and total count
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw AppError.notFound(`User with ID ${id} not found`);
  }

  return user;
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw AppError.notFound(`User with email ${email} not found`);
  }

  return user;
};

/**
 * Get user by username
 */
export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw AppError.notFound(`User with username ${username} not found`);
  }

  return user;
};

/**
 * Check if user exists by ID
 */
export const userExists = async (id: number): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  return !!user;
};

/**
 * Get users count
 */
export const getUsersCount = async (): Promise<number> => {
  return prisma.user.count();
};

/**
 * Create new user (for admin purposes - use auth.service.registerUser for signup)
 */
export const createUser = async (userData: CreateUserInput) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw AppError.conflict('User with this email already exists');
  }

  const user = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * Update user by ID
 */
export const updateUser = async (id: number, userData: UpdateUserInput) => {
  // Check if user exists
  await getUserById(id);

  // If email is being updated, check for conflicts
  if (userData.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser && existingUser.id !== id) {
      throw AppError.conflict('User with this email already exists');
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: userData,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * Delete user by ID
 */
export const deleteUser = async (id: number) => {
  // Check if user exists
  await getUserById(id);

  await prisma.user.delete({
    where: { id },
  });

  return { message: 'User deleted successfully' };
};
