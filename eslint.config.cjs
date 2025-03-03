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
  // svelte.configs.recommended,
  prettier,
  prettierPlugin,
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
  // {
  //   files: ['packages/web/**/*.ts', '**/*.svelte'],
  //   languageOptions: {
  //     parser: tsparser,
  //     parserOptions: {
  //       sourceType: 'module',
  //       ecmaVersion: 2020,
  //       extraFileExtensions: ['.svelte']
  //     }
  //   },
  //   plugins: {
  //     '@typescript-eslint': tseslint
  //   },
  //   settings: {
  //     'svelte/typescript': () => typescript
  //   }
  // },
  {
    files: ['packages/web/**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsparser
      }
    }
  },
  // {
  //   linterOptions: {
  //     reportUnusedDisableDirectives: true,
  //     fix: true // Allow auto-fixing
  //   }
  // },
  {
    ignores: ['eslint.config.cjs']
  }
];
