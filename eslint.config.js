import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },
  {
    ignores: ["dist", "node_modules"],
  },
];
