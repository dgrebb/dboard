import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...eslintPluginSvelte.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.js', '**/*.ts', '**/*.svelte'],
    languageOptions: {
      globals: {
        ...globals.browser,
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
    files: ['**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        RequestInit: true,
        RequestRedirect: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'script',
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
      '.release-please*',
      'tsconfig.json',
    ],
  },
];
