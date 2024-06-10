// TODO: Clean up logs

import { SECRET_NIGHTSCOUT_TOKEN } from '$env/static/private';
import type { FetchOptions } from '$root/lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

const secrets: { [key: string]: string } = {
  SECRET_NIGHTSCOUT_TOKEN: SECRET_NIGHTSCOUT_TOKEN,
};

const resolveSecret = (template: string): string => {
  return template.replace(/\$\{secrets\.([^\}]+)\}/g, (_, key) => {
    return secrets[key] || '';
  });
};

export const prerender = false;
const requestOptions: FetchOptions = {
  method: 'GET',
  redirect: 'follow',
};

const fetchData = async function fetchData(upstreamAPIURL: string) {
  const res = await fetch(upstreamAPIURL, requestOptions);
  const data = await res.json();

  return data;
};

export const GET = (async ({ params, url }) => {
  const upstreamAPIURLTemplate = url.searchParams.get('upstreamAPIURL') || '';
  const evaluatedUpstreamAPIURL = resolveSecret(
    decodeURIComponent(upstreamAPIURLTemplate)
  );
  // console.log('🚀 ~ GET ~ evaluatedUpstreamAPIURL:', evaluatedUpstreamAPIURL);
  const refreshInterval = Number(url.searchParams.get('refreshInterval'));
  const { endpoint } = params;
  // console.log('🚀 ~ start ~ Widget Name:', name);
  // console.log('🚀 ~ start ~ endpoint:', endpoint);
  // console.log('🚀 ~ GET ~ upstreamAPIURL:', upstreamAPIURL);

  async function fetchAndEncodeData(upstreamAPIURL: string) {
    const data = await fetchData(upstreamAPIURL);
    // console.log('🚀 ~ fetchAndEncodeData ~ data:', data);
    return JSON.stringify(data);
  }

  let encodedData: false | string = false;

  // console.log(`Starting stream service for ${endpoint}`);

  try {
    // console.log('🚀 ~ GET ~ time to encode the stream:', endpoint);
    const encoder = new TextEncoder();
    const URL = evaluatedUpstreamAPIURL;
    // console.log('🚀 ~ GET ~ URL:', URL);
    let interval: NodeJS.Timeout;
    const readable = new ReadableStream({
      async start(controller) {
        let i = 0;
        let previousEncodedData = encodedData;
        encodedData = await fetchAndEncodeData(URL);
        // Options for the stream message
        let defaultMsg: string = `Successful response from ${endpoint}, but the data seems malformated.`;
        controller.enqueue(
          encoder.encode(encodedData ? encodedData : defaultMsg)
        );
        console.log('🚀 ~ start ~ initialData:', encodedData);

        interval = setInterval(async () => {
          // controller.enqueue(encoder.encode('i sent another message'));
          i++;
          if (URL !== '') {
            encodedData = await fetchAndEncodeData(URL);
          }

          if (previousEncodedData !== encodedData) {
            const a: string = defaultMsg;
            const b: string | false = encodedData || false;
            console.log('enquing and sending response to UI');
            console.log('🚀 ~ start ~ additionalData:', encodedData);
            previousEncodedData = encodedData;
            controller.enqueue(encoder.encode(b ? b : a));
          }
          console.log(`Reloaded data for ${endpoint} ${i} times.`);
        }, refreshInterval);
        // controller.close();
      },

      async cancel() {
        clearInterval(interval);
      },
    });

    return new Response(readable, {
      headers: {
        'content-type': 'text/event-stream',
      },
    });
  } catch {
    console.info(
      'There is an incorrect match between stream path, id, name, or endpoint'
    );
    return json({
      success: false,
      endpoint,
      message: `There is an incorrect match between the ${endpoint} endpoint's stream path, id, or title.`,
    });
  }
}) satisfies RequestHandler;
