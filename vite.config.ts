import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

import {
  createWSSGlobalInstance,
  onHttpServerUpgrade,
} from './src/lib/server/webSocketUtils';

export default defineConfig({
  plugins: [
    sveltekit(),
    {
      name: 'integratedWebsocketServer',
      configureServer(server) {
        createWSSGlobalInstance();
        server.httpServer?.on('upgrade', onHttpServerUpgrade);
      },
      configurePreviewServer(server) {
        createWSSGlobalInstance();
        server.httpServer?.on('upgrade', onHttpServerUpgrade);
      },
    },
  ],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      $components: path.resolve('./src/lib/components'),
      $utils: path.resolve('./src/utils'),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
