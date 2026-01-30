# Project Setup Summary

## 🚀 Tech Stack
- **TypeScript** - Strict type checking
- **Express.js** - Web framework
- **Zod** - Runtime type validation and parsing
- **Biome** - Fast linting and formatting
- **Husky** - Git hooks for code quality
- **Lint-staged** - Run checks only on staged files

## 📁 Project Structure
```
src/
├── app.ts              # Express app setup
├── server.ts           # Server entry point
├── config/             # Configuration files
│   ├── env.validation.ts # Environment variable validation
├── controllers/        # Route controllers
├── middlewares/        # Express middleware
│   ├── validate.ts     # Zod validation middleware
├── models/             # Type definitions
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Helper functions
├── validators/         # Zod validation schemas
│   ├── user.validator.ts    # User-specific validations
│   ├── common.validator.ts  # Reusable validation schemas
│   └── index.ts        # Validator exports
└── scripts/            # Database scripts
```

## 🛡️ Validation with Zod
This project uses Zod for runtime type validation:

### Basic Usage
```typescript
import { validate } from '@/middlewares/validate';
import { createUserSchema } from '@/validators/user.validator';

// In routes
router.post('/', validate({ body: createUserSchema }), createUser);
```

### Available Validators
- **User validators**: Create, update, query users
- **Common validators**: Pagination, search, sorting
- **Environment validation**: Startup environment checks

## 🛠️ Available Scripts
- `npm run build` - Compile TypeScript
- `npm run start` - Run production server
- `npm run dev` - Build and run development server
- `npm run dev:watch` - Watch TypeScript files
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Biome
- `npm run check` - Run all Biome checks
- `npm run check:fix` - Fix all Biome issues
- `npm run type-check` - TypeScript type checking

## 🔧 Git Hooks (Husky)
### Pre-commit
- Runs `lint-staged` (Biome check on staged files)
- Runs TypeScript type checking
- Ensures code quality before commits

### Commit Message
- Validates conventional commit format
- Required: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

## 📋 Code Quality Rules
### Biome Configuration
- **Style**: Template literals, block statements, no useless else
- **Suspicious**: No explicit any (warn), no console (warn)
- **Correctness**: No unused variables (error)
- **Performance**: No delete operator (warn)

## 🎯 Getting Started
1. `npm install` - Install dependencies
2. Copy `.env.example` to `.env` and configure
3. `npm run build` - Build the project
4. `npm run dev` - Start development server
5. Make changes and commit with conventional format

## 🔍 API Endpoints
- `GET /api/v1/health` - Health check
- `GET /api/v1/users` - Get users (with pagination/search)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## ✅ Example Commit Messages
- `feat: add user authentication`
- `fix(api): resolve login endpoint error`
- `docs: update README with setup instructions`
- `refactor(utils): simplify helper functions`