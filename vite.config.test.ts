import { sveltekit } from '@sveltejs/kit/vite';
import dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'vitest/config';
import {
  createWSSGlobalInstance,
  onHttpServerUpgrade,
} from './src/lib/server/webSocketUtils';

dotenv.config();

const SECRET_AUDIO_CONTROL_IP_ADDRESS =
  process.env.SECRET_AUDIO_CONTROL_IP_ADDRESS;

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
  server: {
    proxy: {
      '/data': {
        target: `https://${SECRET_AUDIO_CONTROL_IP_ADDRESS}`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/data/, '/data'),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] =
              `${SECRET_AUDIO_CONTROL_IP_ADDRESS}`;
            proxyRes.headers['Access-Control-Allow-Methods'] =
              'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] =
              'Content-Type, Authorization';
          });
        },
      },
    },
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      $utils: path.resolve('./src/utils'),
      $assets: path.resolve('./static'),
      $actions: path.resolve('./src/lib/actions'),
      $widgets: path.resolve('./src/lib/widgets'),
      $routes: path.resolve('./src/routes/'),
      $components: path.resolve('./src/lib/components'),
      $layouts: path.resolve('./src/routes/(layouts)'),
      $types: path.resolve('./src/lib/types'),
      $guards: path.resolve('./src/lib/guards'),
      $root: path.resolve('./src'),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
