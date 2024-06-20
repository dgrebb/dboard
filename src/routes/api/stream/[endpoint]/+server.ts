import { SECRET_NIGHTSCOUT_TOKEN } from '$env/static/private';
import type { FetchOptions } from '$root/lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

const secrets: { [key: string]: string } = {
  SECRET_NIGHTSCOUT_TOKEN: SECRET_NIGHTSCOUT_TOKEN,
};

const resolveSecret = (template: string): string => {
  return template.replace(/\$\{secrets\.([^}]+)\}/g, (_, key) => {
    return secrets[key] || '';
  });
};

export const prerender = false;
const requestOptions: FetchOptions = {
  method: 'GET',
  redirect: 'follow',
};

const fetchData = async (upstreamAPIURL: string): Promise<unknown> => {
  try {
    const response = await fetch(upstreamAPIURL, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const GET = (async ({ url }) => {
  const upstreamAPIURLTemplate = url.searchParams.get('upstreamAPIURL') || '';
  const evaluatedUpstreamAPIURL = resolveSecret(
    decodeURIComponent(upstreamAPIURLTemplate)
  );
  const refreshInterval = Number(url.searchParams.get('refreshInterval'));

  try {
    const URL = evaluatedUpstreamAPIURL;
    let interval: NodeJS.Timeout;

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const fetchDataAndEnqueue = async () => {
          try {
            const data = await fetchData(URL);
            const stream = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(stream));
          } catch (error) {
            console.error('Error fetching or enqueuing data:', error);
          }
        };

        await fetchDataAndEnqueue(); // Fetch initial data

        if (!interval) {
          interval = setInterval(fetchDataAndEnqueue, refreshInterval);
        }
      },
      async cancel() {
        clearInterval(interval);
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    console.error('Stream setup error:', message);
    return json({ message });
  }
}) satisfies RequestHandler;
