import { parse } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { nanoid } from 'nanoid';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import { uuidv4 } from '../utils/uuidv4';

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export interface ExtendedWebSocket extends WebSocket {
  socketId: string;
  // userId: string;
}

export type ExtendedWebSocketServer = WebSocketServer;

export type ExtendedGlobal = typeof globalThis & {
  [GlobalThisWSS]: ExtendedWebSocketServer;
};

export const onHttpServerUpgrade = (
  req: IncomingMessage,
  sock: Duplex,
  head: Buffer
) => {
  const pathname = req.url ? parse(req.url).pathname : null;
  if (!pathname?.includes('/websocket')) return;

  const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

  wss.handleUpgrade(req, sock, head, (ws) => {
    const extendedWs = ws as ExtendedWebSocket;
    console.info('[handleUpgrade] creating new connection');
    extendedWs.socketId = uuidv4();
    wss.emit('connection', extendedWs, req);
  });
};

export const createWSSGlobalInstance = () => {
  const wss = new WebSocketServer({
    noServer: true,
  }) as ExtendedWebSocketServer;

  (globalThis as ExtendedGlobal)[GlobalThisWSS] = wss;

  wss.on('connection', (ws) => {
    const extendedWs = ws as ExtendedWebSocket;
    extendedWs.socketId = nanoid();
    console.info(`[wss:global] client connected (${extendedWs.socketId})`);

    extendedWs.on('close', () => {
      console.info(`[wss:global] client disconnected (${extendedWs.socketId})`);
    });
  });

  return wss;
};
