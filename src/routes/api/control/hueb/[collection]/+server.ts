// import { json } from '@sveltejs/kit';
// import { SECRET_HUE_IP_ADDRESS } from '$env/static/private';

// import type { RequestHandler } from './$types';
// import type { FetchOptions } from '@types';

// export const prerender = false;

// export const GET = (async ({ fetch, params: { collection } }) => {
//   const requestOptions: FetchOptions = {
//     method: 'GET',
//     redirect: 'follow',
//   };

//   let status;

//   await fetch(`https://${SECRET_HUE_IP_ADDRESS}/${command}`, requestOptions)
//     .then((response) => response.json())
//     .then((result) => ({ status } = result))
//     .catch((error) => console.error(error));

//   return json({ success: true, status });
// }) satisfies RequestHandler;

// export const POST = (async ({ fetch, params: { command } }) => {
//   const requestOptions: FetchOptions = {
//     method: 'GET',
//     redirect: 'follow',
//   };

//   await fetch(
//     `https://${SECRET_AUDIO_CONTROL_IP_ADDRESS}/httpapi.asp?command=setPlayerCmd:${command}`,
//     requestOptions
//   )
//     .then((response) => response.text())
//     .then((result) => console.info(result))
//     .catch((error) => console.error(error));

//   return json({ success: true });
// }) satisfies RequestHandler;
