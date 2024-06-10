import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const prerender = false;

function setTempo(fetch, locals, url, time) {
  let trackTitle = '';
  setInterval(async function () {
    const response = await fetchTrackInfo(fetch, url);
    const newTrackTitle = response.title;
    console.log('🚀 ~ setTempo ~ trackTitle:', trackTitle);
    console.log('🚀 ~ newTrackTitle:', newTrackTitle);
    console.log(`${trackTitle} is possibly6 the same as ${newTrackTitle}`);
    console.log(
      '🚀 ~ trackTitle != newTrackTitle:',
      trackTitle != newTrackTitle
    );

    if (trackTitle != newTrackTitle && locals.wss) {
      trackTitle = newTrackTitle;
      console.log('🚀 ~ trackTitle:', trackTitle);
      locals.wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          // client.send(`Weather update — at ${new Date().toLocaleString()}`);
          client.send(
            JSON.stringify({
              success: true,
              ...response,
            })
          );
        }
      });
    }
  }, time);
}

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
