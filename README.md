# Node.js Express TypeScript Starter

A production-ready REST API starter template with JWT authentication, built with Node.js, Express, TypeScript, Prisma, and Zod validation.

## 🚀 Tech Stack

- **Node.js & Express 5** - Fast, minimalist web framework
- **TypeScript** - Type-safe development with strict mode
- **Prisma** - Modern ORM with PostgreSQL adapter
- **Passport.js** - Authentication middleware with JWT and Local strategies
- **Argon2** - Secure password hashing
- **Zod** - Runtime type validation and schema parsing
- **Winston** - Structured logging with file rotation
- **Biome** - Fast linting and code formatting
- **Husky** - Git hooks for code quality enforcement

## ✨ Features

- **JWT Authentication** - Complete auth system with access/refresh tokens
- **Passport.js Integration** - Local and JWT strategies for authentication
- **Secure Password Hashing** - Argon2 for password encryption
- **HTTP-Only Cookies** - Secure token storage with configurable options
- **Token Rotation** - Automatic refresh token rotation for enhanced security
- **Multi-Device Logout** - Logout from all devices functionality
- RESTful API architecture with clean separation of concerns
- Request validation using Zod schemas
- Centralized error handling with custom error classes
- Prisma ORM with PostgreSQL database
- Environment variable validation on startup
- Structured logging with Winston and Morgan
- Security middleware (Helmet, CORS, Compression, Cookie Parser)
- Path aliases for clean imports (@/config, @/utils, etc.)
- Git hooks for automated code quality checks
- Conventional commit message enforcement

## 📁 Project Structure

```
src/
├── app.ts                       # Express app configuration
├── server.ts                    # Server entry point
├── config/                      # Configuration files
│   ├── config.ts                # Main config export
│   ├── env.validation.ts        # Environment validation with Zod
│   ├── logger.ts                # Winston logger setup
│   ├── morgan.ts                # HTTP request logging
│   ├── passport.ts              # Passport.js strategies (JWT, Local)
│   └── prisma.ts                # Database connection
├── controllers/                 # Request handlers
│   ├── auth.controller.ts       # Authentication operations
│   └── user.controller.ts       # User CRUD operations
├── middlewares/                 # Express middleware
│   ├── auth.middleware.ts       # JWT authentication middleware
│   ├── error.middleware.ts      # Global error handling
│   └── validate.middleware.ts   # Zod validation middleware
├── routes/                      # API route definitions
│   ├── index.routes.ts          # Main router
│   ├── auth.routes.ts           # Authentication routes
│   └── user.routes.ts           # User routes
├── services/                    # Business logic layer
│   ├── auth.service.ts          # Authentication service
│   └── user.service.ts          # User service
├── validators/                  # Zod schemas
│   ├── auth.validator.ts        # Auth validation schemas
│   ├── user.validator.ts        # User validation schemas
│   └── common.validator.ts      # Reusable schemas
├── utils/                       # Helper utilities
│   ├── AppError.ts              # Custom error class
│   ├── catchAsync.ts            # Async error wrapper
│   ├── response.ts              # Response formatters
│   └── prismaErrorMapper.ts     # Prisma error handler
└── generated/                   # Prisma generated client
    └── prisma/                  # Generated Prisma client
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

3. Configure your database and authentication in `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/myapp"
JWT_ACCESS_SECRET="your-super-secret-access-token-key-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-min-32-chars"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
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

The API will be available at `http://localhost:5000`

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

### Authentication
```
POST   /api/v1/auth/register      # Register new user
POST   /api/v1/auth/login         # Login with username/email and password
POST   /api/v1/auth/refresh       # Refresh access token
POST   /api/v1/auth/logout        # Logout (revoke refresh token)
POST   /api/v1/auth/logout-all    # Logout from all devices (Protected)
GET    /api/v1/auth/me            # Get current user (Protected)
```

### Users
```
GET    /api/v1/users              # Get all users (with pagination & search)
GET    /api/v1/users/:id          # Get user by ID
POST   /api/v1/users              # Create new user
PUT    /api/v1/users/:id          # Update user
DELETE /api/v1/users/:id          # Delete user
```

### Example Requests
```bash
# Register a new user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123!"
  }'

# Get current user (with JWT token)
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔐 Authentication

### JWT Token Strategy
The application uses a dual-token authentication system:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

### Token Storage
Tokens are stored in HTTP-only cookies for security:
- Prevents XSS attacks
- CSRF protection with SameSite=strict
- Configurable domain and secure flags
- Also returned in response body for stateless clients

### Password Security
- Passwords hashed with Argon2 (more secure than bcrypt)
- Automatic password validation on registration
- Secure password comparison during login

### Protected Routes
Use the `authenticate` middleware to protect routes:

```typescript
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);
```

### Token Refresh Flow
1. Client sends refresh token to `/auth/refresh`
2. Server validates and rotates the token (revokes old, issues new)
3. New access and refresh tokens returned
4. Old refresh token is invalidated

## 🛡️ Validation

Request validation is handled by Zod schemas with automatic error formatting:

```typescript
// Define schema
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3),
    name: z.string().min(1),
    password: z.string().min(8),
  }),
});

// Use in routes
router.post('/register', validate(registerSchema), register);
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
- **Helmet.js** - Security headers
- **CORS** - Configurable cross-origin resource sharing
- **HTTP-Only Cookies** - Prevents XSS attacks
- **Argon2 Password Hashing** - Industry-standard password encryption
- **JWT Authentication** - Secure token-based auth with refresh rotation
- **Request Body Limits** - 10mb size limit
- **Environment Validation** - Startup validation of all required env vars
- **Passport.js** - Battle-tested authentication middleware

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

Prisma ORM with PostgreSQL and custom output directory:

```prisma
model User {
  id            Int            @id @default(autoincrement())
  email         String         @unique
  username      String         @unique
  name          String
  password      String
  avatar        String         @default("https://ui-avatars.com/api/?name=U&color=7F9CF5&background=EBF4FF")
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  expiresAt DateTime
  revoked   Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
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
PORT=5000
DATABASE_URL=your_production_db_url
JWT_ACCESS_SECRET=your_production_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_production_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
COOKIE_SECURE=true
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