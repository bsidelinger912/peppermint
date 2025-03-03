// eslint.config.cjs (CommonJS)
const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const prettier = require('eslint-config-prettier');

module.exports = [
  eslint.configs.recommended,
  {
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest'
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules
    }
  },
  prettier,
  {
    ignores: ['eslint.config.cjs']
  }
];
