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
      // ...svelte.configs.recommended.rules,
      'svelte/comment-directive': 'error',
      'svelte/no-at-debug-tags': 'warn',
      'svelte/no-at-html-tags': 'error',
      'svelte/no-dupe-else-if-blocks': 'error',
      'svelte/no-dupe-style-properties': 'error',
      'svelte/no-dynamic-slot-name': 'error',
      'svelte/no-inner-declarations': 'error',
      'svelte/no-not-function-handler': 'error',
      'svelte/no-object-in-text-mustaches': 'error',
      'svelte/no-shorthand-style-property-overrides': 'error',
      'svelte/no-unknown-style-directive-property': 'error',
      'svelte/no-unused-svelte-ignore': 'error',
      'svelte/system': 'error',
      'svelte/valid-compile': 'error'
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
