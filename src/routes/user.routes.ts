import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '@/controllers/user.controller';
import { validate } from '@/middlewares/validate';
import {
  createUserSchema,
  getUsersQuerySchema,
  updateUserSchema,
  userParamsSchema,
} from '@/validators/user.validator';

const router = Router();

// GET /users - Get all users with pagination and search
router.get('/', validate({ query: getUsersQuerySchema }), getUsers);

// GET /users/:id - Get user by ID
router.get('/:id', validate({ params: userParamsSchema }), getUserById);

// POST /users - Create new user
router.post('/', validate({ body: createUserSchema }), createUser);

// PUT /users/:id - Update user by ID
router.put(
  '/:id',
  validate({ params: userParamsSchema, body: updateUserSchema }),
  updateUser
);

// DELETE /users/:id - Delete user by ID
router.delete('/:id', validate({ params: userParamsSchema }), deleteUser);

export default router;
