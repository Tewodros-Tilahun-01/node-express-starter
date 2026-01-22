# Husky Git Hooks

This project uses Husky to run automated checks before commits and pushes.

## Pre-commit Hook

- Runs `lint-staged` to format and lint only staged files
- Runs TypeScript type checking
- Ensures code quality before commits

## Commit Message Hook

- Validates commit message format using conventional commits
- Required format: `type(scope): description`
- Supported types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

## Examples of valid commit messages:

- `feat: add user authentication`
- `fix(api): resolve login endpoint error`
- `docs: update README with setup instructions`
- `refactor(utils): simplify helper functions`

## Setup

Run `npm run prepare` to install git hooks after cloning the repository.
