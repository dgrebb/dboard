// import { json } from '@sveltejs/kit';
// import { musicInfo } from '$lib/music';

// import type { RequestHandler } from './$types';

// export const GET = (async ({ url, locals }) => {
//   if (locals.wss) {
//     locals.wss.clients.forEach((client) => {
//       if (client.readyState === 1) {
//         client.send(
//           `Hello from the GET handler at ${new Date().toLocaleString()}`
//         );
//       }
//     });
//   }

//   return json({ success: true, ...musicInfo });
// }) satisfies RequestHandler;
