import { json, type RequestHandler } from '@sveltejs/kit';

export const prerender = false;

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export const GET = (async ({ params }) => {
  const { endpoint } = params;
  try {
    console.log('🚀 ~ GET ~ time to encode the stream:', endpoint);
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < 20; i++) {
          controller.enqueue(encoder.encode(`hello from ${endpoint} ${i}`));
          await delay(1000);
          // console.log('🚀 ~ start ~ endpoint:', endpoint);
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'content-type': 'text/event-stream',
      },
    });
  } catch {
    console.info(
      'There is an incorrect match between stream path, id, title, or endpoint'
    );
    return json({
      success: false,
      endpoint,
      message: `There is an incorrect match between the ${endpoint} endpoint's stream path, id, or title.`,
    });
  }
}) satisfies RequestHandler;
