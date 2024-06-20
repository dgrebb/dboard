import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const prerender = false;

async function fetchTrackInfo(fetch, url) {
  const music = await fetch(`${url.origin}/music.json`);
  const response = JSON.parse(await music.text());

  return response;
}

export const GET = (async ({ fetch, locals, url }) => {
  // setTempo(fetch, locals, url, 15000);

  const response = await fetchTrackInfo(fetch, url);

  return json({ success: true, ...response });
}) satisfies RequestHandler;
