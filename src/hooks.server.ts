import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
  try {
    const response = await resolve(event, {
      filterSerializedResponseHeaders: (name) => name === 'content-type',
    });
    return response;
  } catch (e) {
    console.error('Error encountered in server hooks.', e);
    // Return a default response in case of error
    return new Response('Internal Server Error', { status: 500 });
  }
}) satisfies Handle;
