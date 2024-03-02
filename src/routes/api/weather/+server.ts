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

	// TODO: refactor for open-meto
	// https://open-meteo.com/en/docs/#current=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=1
	const [weather] = await Promise.all([
		fetch(
		'https://api.open-meteo.com/v1/forecast?latitude=40.2260689&longitude=-75.2830657&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=1',
			requestOptions
		)
			.then((response) => response.json())
			.catch((error) => console.error(error))
	]);
	console.log("🚀 ~ GET ~ weather:", weather)

	return json({
    success: true,
    weather: {
			current: weather.current.temperature_2m,
		}
	});

	return json({ success: true, message: 'Hello world from GET handler', url });
}) satisfies RequestHandler;