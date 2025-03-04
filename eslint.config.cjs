// eslint.config.cjs (CommonJS)
const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier/recommended'); 
const svelte = require('eslint-plugin-svelte');
const svelteParser = require('svelte-eslint-parser');
const react = require('eslint-plugin-react');
// const globals = require('globals');
// const { FlatCompat } = require('@eslint/eslintrc');
// // const { fixupConfigRules } = require("@eslint/compat");
// const expo = require("eslint-config-expo");

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// console.log(expo);

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
    files: ['**/*.tsx'],
    plugins: {
      react
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        process: true,
        // ...globals.browser,
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
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
    ignores: [
      'eslint.config.cjs', 
      'packages/web/.svelte-kit', 
      'packages/native/tailwind.config.js',
      'packages/native/scripts/reset-project.js',
      'packages/native/babel.config.js',
      'packages/native/metro.config.js'
    ]
  }
];
