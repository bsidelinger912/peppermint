// eslint.config.cjs (CommonJS)
const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier/recommended'); 
const svelte = require('eslint-plugin-svelte');
const svelteParser = require('svelte-eslint-parser');

module.exports = [
  eslint.configs.recommended,
  prettier,
  prettierPlugin,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest'
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...svelte.configs.recommended.rules,
    }
  },
  {
    files: ['packages/web/**/*.ts', '**/*.svelte'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte']
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    settings: {
      'svelte/typescript': () => typescript
    }
  },
  {
    files: ['packages/web/**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsparser
      }
    }
  },
  {
    ignores: ['eslint.config.cjs', 'packages/web/.svelte-kit']
  }
];
