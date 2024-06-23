import type { Fetch, FetchOptions, NowPlayingData } from '$root/lib/types';
// import { fetchMediaInfo } from '$utils/wiim';
import { json, type RequestEvent } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';

export const prerender = false;

const URL = '/api/v1/music';
const refreshInterval = 5000;
const requestOptions: FetchOptions = {
  method: 'GET',
  redirect: 'follow',
};

const fetchData = async (fetch: Fetch): Promise<NowPlayingData> => {
  try {
    const response = await fetch(URL, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const GET = async (event: RequestEvent | LoadEvent) => {
  const fetch = event.fetch as Fetch;
  let current: NowPlayingData;

  try {
    let interval: NodeJS.Timeout;
    let controllerClosed = false;

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const fetchDataAndEnqueue = async (fetch: Fetch) => {
          try {
            if (controllerClosed) return;
            // TODO: Refactor with WiiM API in `$lib/utils/wiim.ts`
            // fetchMediaInfo(fetch);
            const timestamp = Date.now();
            const data = await fetchData(fetch);
            if (
              (data && current?.title !== data.title) ||
              current?.loved !== data.loved
            ) {
              const nowPlaying: NowPlayingData = {
                ...data,
                art:
                  data && current?.album !== data.album
                    ? `/data/AirplayArtWorkData.png?ts=${timestamp}`
                    : '/data/AirplayArtWorkData.png',
              };
              current = nowPlaying;
              const stream = `data: ${JSON.stringify(nowPlaying)}\n\n`;
              controller.enqueue(encoder.encode(stream));
            }
          } catch (error) {
            console.error('Error fetching or enqueuing data:', error);
          }
        };

        await fetchDataAndEnqueue(fetch); // Fetch initial data

        if (!interval) {
          interval = setInterval(async () => {
            fetchDataAndEnqueue(fetch);
          }, refreshInterval);
        }
      },
      async cancel() {
        controllerClosed = true;
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
};
