import { json } from '@sveltejs/kit';
import { SECRET_NIGHTSCOUT_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET = (async ({ url, locals }) => {
  if (locals.wss) {
    locals.wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(`Hello from the GET handler at ${new Date().toLocaleString()}`);
      }
    });
  }

	// call server for data
	const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	const [nightscout] = await Promise.all([
		fetch(
			`https://glu.7ub3s.net/api/v1/entries.json?count=1&token=${SECRET_NIGHTSCOUT_TOKEN}`,
			requestOptions
		)
			.then((response) => response.json())
			.catch((error) => console.error(error))
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
              color: '#CC4522'
            },
            large: {
              value: nightscout[0]['sgv'],
              color: '#A5371B'
            }
          }
        }
      ]
    }
	});

	return json({ success: true, message: 'Hello world from GET handler', url });
}) satisfies RequestHandler;