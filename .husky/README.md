# Husky Git Hooks with Biome

This project uses Husky v9+ with Biome for fast, efficient code quality checks.

## 🔧 Git Hooks Configuration

### Pre-commit Hook
- Runs `lint-staged` with Biome for ultra-fast linting and formatting
- Runs TypeScript type checking
- Only processes staged files for optimal performance

### Pre-push Hook
- Runs `biome ci` for comprehensive CI-like checks
- Runs full TypeScript type checking
- Ensures code quality before pushing to remote

### Commit Message Hook
- Validates conventional commit message format
- Required format: `type(scope): description`
- Comprehensive validation with helpful error messages



## 🎯 Commit Message Format

### Valid Types
- `feat` - new feature
- `fix` - bug fix  
- `docs` - documentation
- `style` - formatting, missing semi colons, etc
- `refactor` - code change that neither fixes a bug nor adds a feature
- `test` - adding missing tests
- `chore` - maintain
- `perf` - performance improvement
- `ci` - CI/CD changes
- `build` - build system changes
- `revert` - revert previous commit

### Examples
- `feat: add user authentication`
- `fix(api): resolve login endpoint error`
- `docs: update README with setup instructions`
- `refactor(utils): simplify helper functions`

## 🚀 Setup
Hooks are automatically installed when running `npm install` via the `prepare` script.