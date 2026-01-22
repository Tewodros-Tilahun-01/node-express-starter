import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  // Base config for all JS/TS files
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Airbnb-style rules
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },

  // JavaScript-specific rules
  js.configs.recommended,

  // TypeScript-specific rules
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off', // Turn off base rule for TS files
    },
  },

  // Prettier config (last to override)
  prettier,

  // Ignore patterns
  {
    ignores: ['dist/', 'node_modules/', 'coverage/'],
  },
];
