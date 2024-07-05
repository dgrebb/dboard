import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.js', '**/*.ts', '**/*.svelte'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte'],
    plugins: {
      eslint: eslint,
      tseslint: tseslint,
    },
    rules: {
      'svelte/no-at-html-tags': 'off',
    },
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte'],
      },
    },
  },
  {
    files: ['tsconfig.json', 'jsconfig.json'],
    languageOptions: {
      parserOptions: {
        parser: 'jsonc',
      },
    },
  },
  {
    ignores: [
      'node_modules',
      'build',
      '.svelte-kit',
      'pnpm-lock.yaml',
      'static/kiosk_functions.js',
      'src/routes/grid/*',
      '.env.*',
    ],
  },
];
