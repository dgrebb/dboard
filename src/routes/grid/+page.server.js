import { SECRET_NIGHTSCOUT_TOKEN } from '$env/static/private';

export async function load() {
	// call server for data
	const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	const [test] = await Promise.all([
		fetch(
			`https://glu.7ub3s.net/api/v1/entries.json?count=1&token=${SECRET_NIGHTSCOUT_TOKEN}`,
			requestOptions
		)
			.then((response) => response.json())
			.catch((error) => console.error(error))
	]);

	return {
		items: [
			{
				title: 'glu',
				content: {
					small: {
						value: 'mg/dl',
						color: '#CC4522'
					},
					large: {
						value: test[0]['sgv'],
						color: '#A5371B'
					}
				}
			}
		]
	};
}
