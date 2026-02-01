import { Router } from 'express';
import { userController } from '@/controllers';
import { validate } from '@/middlewares';
import {
  createUserSchema,
  getUsersQuerySchema,
  updateUserSchema,
  userParamsSchema,
} from '@/validators';

const router = Router();

// GET /users - Get all users with pagination and search
router.get(
  '/',
  validate({ query: getUsersQuerySchema }),
  userController.getUsers
);

// GET /users/:id - Get user by ID
router.get(
  '/:id',
  validate({ params: userParamsSchema }),
  userController.getUserById
);

// POST /users - Create new user
router.post(
  '/',
  validate({ body: createUserSchema }),
  userController.createUser
);

// PUT /users/:id - Update user by ID
router.put(
  '/:id',
  validate({ params: userParamsSchema, body: updateUserSchema }),
  userController.updateUser
);

// DELETE /users/:id - Delete user by ID
router.delete(
  '/:id',
  validate({ params: userParamsSchema }),
  userController.deleteUser
);

export default router;
