import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET = (async ({ fetch, locals, url }) => {
  const music = await fetch(`${url.origin}/music.json`);
  const response = JSON.parse(await music.text());
  if (locals.wss) {
    locals.wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(
          `Hello from the GET handler at ${new Date().toLocaleString()}`
        );
      }
    });
  }

  return json({ success: true, ...response });
}) satisfies RequestHandler;
