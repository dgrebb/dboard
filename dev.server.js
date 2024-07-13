import http2 from 'http2';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import express from 'express';
import { sveltekit } from '@sveltejs/kit/vite';
import { createProxyServer } from 'http-proxy';

dotenv.config();

const certPath = path.resolve('./.config/ssl/dboard.server+7.pem');
const keyPath = path.resolve('./.config/ssl/dboard.server+7-key.pem');
const SECRET_AUDIO_CONTROL_IP_ADDRESS =
  process.env.SECRET_AUDIO_CONTROL_IP_ADDRESS;

const serverOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  allowHTTP1: true, // fallback support for HTTP/1.1
  rejectUnauthorized: false, // WARNING: this makes TLS connections insecure
};

const startServer = async () => {
  const app = express();
  const vite = await createViteServer({
    plugins: [sveltekit()],
    server: {
      middlewareMode: 'ssr',
    },
  });

  // Integrate Vite middlewares
  app.use(vite.middlewares);

  // Create HTTP/2 server
  const httpServer = http2.createSecureServer(serverOptions, app);

  // Create a custom https.Agent to ignore self-signed certificate errors
  const agent = new https.Agent({
    rejectUnauthorized: false, // WARNING: this makes TLS connections insecure
  });

  // Proxy server configuration
  const proxy = createProxyServer({
    target: `https://${SECRET_AUDIO_CONTROL_IP_ADDRESS}`,
    changeOrigin: true,
    secure: false,
    agent: agent, // Use the custom https.Agent
  });

  proxy.on('proxyRes', (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] =
      'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] =
      'Content-Type, Authorization';
  });

  proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.sendStatus(500);
  });

  // Middleware to proxy requests to /data
  app.use('/data', (req, res) => {
    req.url = req.originalUrl;
    proxy.web(req, res);
  });

  // Health check endpoint
  app.get('/healthcheck', (req, res) => {
    res.end('ok');
  });

  // SSE handling
  httpServer.on('stream', (stream, headers) => {
    if (headers[':path'] === '/api/streams') {
      stream.respond({
        'content-type': 'text/event-stream',
        ':status': 200,
      });

      const sendEvent = (data) => {
        stream.write(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Example data to send, replace with actual data fetching logic
      const exampleData = [
        { type: 'widget1', content: 'data1' },
        { type: 'widget2', content: 'data2' },
        // Add more widgets data here
      ];

      setInterval(() => {
        exampleData.forEach(sendEvent);
      }, 1000);
    }
  });

  // Start HTTP/2 server
  httpServer.listen(443, () => {
    console.info('HTTP/2 server running on https://localhost:443');
  });
};

startServer();
