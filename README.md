# Project Setup Summary

## 🚀 Tech Stack
- **TypeScript** - Strict type checking
- **Express.js** - Web framework
- **Biome** - Fast linting and formatting
- **Husky** - Git hooks for code quality
- **Lint-staged** - Run checks only on staged files

## 📁 Project Structure
```
src/
├── app.ts              # Express app setup
├── server.ts           # Server entry point
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middlewares/        # Express middleware
├── models/             # Type definitions
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Helper functions
├── validators/         # Input validation
└── scripts/            # Database scripts
```

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
2. `npm run build` - Build the project
3. `npm run dev` - Start development server
4. Make changes and commit with conventional format

## ✅ Example Commit Messages
- `feat: add user authentication`
- `fix(api): resolve login endpoint error`
- `docs: update README with setup instructions`
- `refactor(utils): simplify helper functions`