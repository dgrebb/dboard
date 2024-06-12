// import { redirect } from '@sveltejs/kit';
import { SECRET_NIGHTSCOUT_TOKEN } from '$env/static/private';

export async function load() {
  // NOTE: Redirect to v2 for testing wallmount
  // redirect(302, '/v2'); // needs `throw` in v1

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const [readings] = await Promise.all([
    fetch(
      `https://glu.7ub3s.net/api/v1/entries.json?count=1&token=${SECRET_NIGHTSCOUT_TOKEN}`,
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.error(error)),
  ]);

  return {
    items: [
      {
        title: 'glu',
        content: {
          small: {
            value: 'mg/dl',
            color: '#CC4522',
          },
          large: {
            value: readings[0]['sgv'],
            color: '#A5371B',
          },
        },
      },
    ],
  };
}
