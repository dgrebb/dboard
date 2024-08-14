/**
 * @warning
 * Setting NODE_TLS_REJECT_UNAUTHORIZED to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
 * This should only be used in a trusted local development environment.
 * Do not use this setting in production environments as it exposes the application to security vulnerabilities.
 * @see setupInsecureSSL
 */
import { setupInsecureSSL } from './sslConfig.js';

setupInsecureSSL();

import { sveltekit } from '@sveltejs/kit/vite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vitest/config';

// NOTE: When SSE isn't enough...
// import {
//   createWSSGlobalInstance,
//   onHttpServerUpgrade,
// } from './src/lib/server/webSocketUtils';

// Load environment variables from .env file
dotenv.config();

/**
 * @warning
 * Using self-signed certificates can make your application vulnerable to man-in-
 * the-middle attacks.
 * This should only be used in a trusted local development environment.
 * Do not use self-signed certificates in production environments as they do not
 * provide the same level of security as certificates issued by a trusted Certificate
 * Authority.
 */
const certPath = path.resolve('./.config/ssl/dboard.server+7.pem');
const keyPath = path.resolve('./.config/ssl/dboard.server+7-key.pem');

const { SECRET_AUDIO_CONTROL_IP_ADDRESS } = process.env;

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
      rejectUnauthorized:
        false /* WARNING: this makes TLS connections and HTTPS requests insecure by 
        disabling certificate verification. */,
    },
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
      '@utils': path.resolve('./src/lib/utils'),
      '@assets': path.resolve('./static'),
      '@actions': path.resolve('./src/lib/actions'),
      '@widgets': path.resolve('./src/lib/widgets'),
      '@routes': path.resolve('./src/routes/'),
      '@components': path.resolve('./src/lib/components'),
      '@layouts': path.resolve('./src/routes/(layouts)'),
      '@types': path.resolve('./src/lib/types'),
      '@guards': path.resolve('./src/lib/guards'),
      '@root': path.resolve('./src'),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
