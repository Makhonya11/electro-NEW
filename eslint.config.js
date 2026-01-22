import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import tsplugin from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      '@typescript-eslint': tsplugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/unbound-method': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },

  prettier,
];
