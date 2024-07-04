import { SECRET_NIGHTSCOUT_TOKEN } from '$env/static/private';
import type { FetchOptions } from '$lib/types';
import { NIGHTSCOUT_API } from '$root/.config/GLOBALS';
import { glu } from '$root/.config/settings';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const dataPoints = glu.hoursDisplayed * 12;

export const GET = (async ({ url }) => {
  // if (locals.wss) {
  //   locals.wss.clients.forEach((client) => {
  //     if (client.readyState === 1) {
  //       client.send(
  //         `Hello from the GET handler at ${new Date().toLocaleString()}`
  //       );
  //     }
  //   });
  // }

  // call server for data
  const requestOptions: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const [nightscout] = await Promise.all([
    fetch(
      `${NIGHTSCOUT_API}/entries.json?count=${dataPoints}&token=${SECRET_NIGHTSCOUT_TOKEN}`,
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.error(error)),
  ]);

  return json({
    success: true,
    nightscout: {
      items: [
        {
          title: 'glu',
          content: {
            small: {
              value: 'mg/dl',
              direction: nightscout[0]['direction'],
              color: '#CC4522',
            },
            large: {
              value: nightscout[0]['sgv'],
              color: '#A5371B',
            },
            trend: {
              direction: nightscout[0]['direction'],
              difference: Math.abs(nightscout[0]['sgv'] - nightscout[1]['sgv']),
            },
          },
          series: nightscout,
        },
      ],
    },
  });

  return json({ success: true, message: 'Hello world from GET handler', url });
}) satisfies RequestHandler;
