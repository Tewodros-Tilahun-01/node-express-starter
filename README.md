# Node.js Express TypeScript Starter

A production-ready REST API starter template built with Node.js, Express, TypeScript, Prisma, and Zod validation.

## 🚀 Tech Stack

- **Node.js & Express** - Fast, minimalist web framework
- **TypeScript** - Type-safe development with strict mode
- **Prisma** - Modern ORM with PostgreSQL adapter
- **Zod** - Runtime type validation and schema parsing
- **Winston** - Structured logging with file rotation
- **Biome** - Fast linting and code formatting
- **Husky** - Git hooks for code quality enforcement
- **JWT** - Token-based authentication support

## ✨ Features

- RESTful API architecture with clean separation of concerns
- Request validation using Zod schemas
- Centralized error handling with custom error classes
- Prisma ORM with PostgreSQL database
- Environment variable validation on startup
- Structured logging with Winston and Morgan
- Security middleware (Helmet, CORS, Compression)
- Path aliases for clean imports (@/config, @/utils, etc.)
- Git hooks for automated code quality checks
- Conventional commit message enforcement

## 📁 Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server entry point
├── config/                   # Configuration files
│   ├── index.ts              # Main config export
│   ├── env.validation.ts     # Environment validation
│   ├── logger.ts             # Winston logger setup
│   ├── morgan.ts             # HTTP request logging
│   └── prisma.ts             # Database connection
├── controllers/              # Request handlers
│   └── user.controller.ts    # User CRUD operations
├── middlewares/              # Express middleware
│   ├── auth.ts               # Authentication middleware
│   ├── errorHandler.ts       # Global error handling
│   └── validate.ts           # Zod validation middleware
├── routes/                   # API route definitions
│   ├── index.ts              # Main router
│   └── user.routes.ts        # User routes
├── services/                 # Business logic layer
│   └── user.service.ts       # User service
├── validators/               # Zod schemas
│   ├── user.validator.ts     # User validation schemas
│   └── common.validator.ts   # Reusable schemas
├── utils/                    # Helper utilities
│   ├── AppError.ts           # Custom error class
│   ├── catchAsync.ts         # Async error wrapper
│   ├── response.ts           # Response formatters
│   └── prismaErrorMapper.ts  # Prisma error handler
└── generated/                # Prisma generated client
```

## 🎯 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Configure your database connection in `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/myapp"
JWT_SECRET="your-super-secret-jwt-key"
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Biome
- `npm run check` - Run all Biome checks
- `npm run check:fix` - Fix all issues automatically
- `npm run type-check` - TypeScript type checking
- `npm run prisma:generate` - Generate Prisma client

## 🔍 API Endpoints

### Health Check
```
GET /api/v1/health
```

### Users
```
GET    /api/v1/users           # Get all users (with pagination)
GET    /api/v1/users/:id       # Get user by ID
POST   /api/v1/users           # Create new user
PUT    /api/v1/users/:id       # Update user
DELETE /api/v1/users/:id       # Delete user
```

### Example Request
```bash
# Create a user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## 🛡️ Validation

Request validation is handled by Zod schemas with automatic error formatting:

```typescript
// Define schema
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// Use in routes
router.post('/', validate({ body: createUserSchema }), createUser);
```

Validation errors return structured responses:
```json
{
  "error": true,
  "code": 400,
  "message": "Validation error: Invalid email format"
}
```

## 🔧 Error Handling

Centralized error handling with custom error classes:

```typescript
// Throw custom errors
throw AppError.notFound('User not found');
throw AppError.badRequest('Invalid input');
throw AppError.unauthorized('Invalid credentials');

// Automatic Prisma error mapping
// P2002 -> Conflict (409)
// P2025 -> Not Found (404)
```

## 📝 Logging

Winston logger with multiple transports:
- Console output (development)
- File logging (combined.log, error.log, access.log)
- HTTP request logging with Morgan

```typescript
import { logger } from '@/config/logger';

logger.info('User created successfully');
logger.error('Database connection failed', { error });
```

## 🔐 Security

Built-in security features:
- Helmet.js for security headers
- CORS configuration
- Request body size limits (10mb)
- Environment variable validation
- JWT authentication support

## 🎨 Code Quality

### Git Hooks (Husky)
- **Pre-commit**: Runs linting and type checking on staged files
- **Commit-msg**: Enforces conventional commit format

### Conventional Commits
```
feat: add user authentication
fix(api): resolve login endpoint error
docs: update README
refactor(utils): simplify error handling
```

### Biome Configuration
- Strict linting rules
- Automatic code formatting
- Import sorting
- No unused variables
- Consistent code style

## 🗄️ Database

Prisma ORM with PostgreSQL:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}
```

Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma studio  # Open Prisma Studio
```

## 🚀 Deployment

Build for production:
```bash
npm run build
npm start
```

Environment variables for production:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_production_db_url
JWT_SECRET=your_production_secret
LOG_LEVEL=info
```

## 📦 Path Aliases

Clean imports using TypeScript path aliases:

```typescript
import config from '@/config';
import { logger } from '@/config/logger';
import { AppError } from '@/utils/AppError';
import { validate } from '@/middlewares/validate';
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run check:fix` to ensure code quality
5. Commit using conventional commit format
6. Submit a pull request

## 📄 License

MIT License - feel free to use this starter for your projects!