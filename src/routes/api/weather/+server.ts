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

	const [weather] = await Promise.all([
		fetch(
		'https://api.weather.gov/gridpoints/PHI/44,87/forecast/hourly',
			requestOptions
		)
			.then((response) => response.json())
			.catch((error) => console.error(error))
	]);

  const hours = weather.properties.periods;

	return json({
    success: true,
    data: hours
	});

	return json({ success: true, message: 'Hello world from GET handler', url });
}) satisfies RequestHandler;