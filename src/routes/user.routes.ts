import { Router } from 'express';
import { userController } from '@/controllers';
import { validateMiddleware } from '@/middlewares';
import * as userValidator from '@/validators/user.validator';

const router = Router();

// GET /users - Get all users with pagination and search
router.get(
  '/',
  validateMiddleware.validate({ query: userValidator.getUsersQuerySchema }),
  userController.getUsers
);

// GET /users/:id - Get user by ID
router.get(
  '/:id',
  validateMiddleware.validate({ params: userValidator.userParamsSchema }),
  userController.getUserById
);

// POST /users - Create new user
router.post(
  '/',
  validateMiddleware.validate({ body: userValidator.createUserSchema }),
  userController.createUser
);

// PUT /users/:id - Update user by ID
router.put(
  '/:id',
  validateMiddleware.validate({
    params: userValidator.userParamsSchema,
    body: userValidator.updateUserSchema,
  }),
  userController.updateUser
);

// DELETE /users/:id - Delete user by ID
router.delete(
  '/:id',
  validateMiddleware.validate({ params: userValidator.userParamsSchema }),
  userController.deleteUser
);

export default router;
