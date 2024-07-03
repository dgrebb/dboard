/**
 * @warning
 * Setting NODE_TLS_REJECT_UNAUTHORIZED to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
 * This should only be used in a trusted local development environment.
 * Do not use this setting in production environments as it exposes the application to security vulnerabilities.
 * @see setupInsecureSSL
 */
import { setupInsecureSSL } from './sslConfig.js';

setupInsecureSSL();

import { handler } from './build/handler.js';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import dotenv from 'dotenv';
import pkg from 'http-proxy';
const { createProxyServer } = pkg;

// Load environment variables from .env file
dotenv.config();

const privateKey = fs.readFileSync(
  './.config/ssl/dboard.server+7-key.pem',
  'utf8'
);
const certificate = fs.readFileSync(
  './.config/ssl/dboard.server+7.pem',
  'utf8'
);
const credentials = { key: privateKey, cert: certificate };

const app = express();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const PORT = 80;
const SSLPORT = 443;

const SECRET_AUDIO_CONTROL_IP_ADDRESS =
  process.env.SECRET_AUDIO_CONTROL_IP_ADDRESS;

// Create a custom https.Agent to ignore self-signed certificate errors
const agent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * Proxy server to forward requests to the target server.
 * @type {import('http-proxy').ProxyServer}
 */
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

/**
 * Middleware to proxy requests to /data.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
app.use('/data', (req, res) => {
  req.url = req.originalUrl;
  proxy.web(req, res);
});

httpServer.listen(PORT, () => {
  console.info('HTTP Server is running on: http://dboard.server:%s', PORT);
});

httpsServer.listen(SSLPORT, () => {
  console.info('HTTPS Server is running on: https://dboard.server:%s', SSLPORT);
});

/**
 * Health check endpoint.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
app.get('/healthcheck', (req, res) => {
  res.end('ok');
});

// Let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);
