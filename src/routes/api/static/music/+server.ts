import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET = (async ({ fetch }) => {
  const music = await fetch('/music.json');
  const response = JSON.parse(await music.text());

  return json({ success: true, ...response });
}) satisfies RequestHandler;
