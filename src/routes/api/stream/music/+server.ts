import type { Fetch, FetchOptions, NowPlayingData } from '$root/lib/types';
import { fetchMediaInfo } from '$utils/wiim';
import { json, type RequestEvent } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';
import { colorThief } from '$utils/colorThief';
import { homeState } from '$root/lib/stores';
import { timeStringToMilliseconds } from '$utils/strings';

export const prerender = false;

const URL = '/api/v1/music';
let refreshInterval = 5000;
const requestOptions: FetchOptions = {
  method: 'GET',
  redirect: 'follow',
};

const createGradient = async (image: string): Promise<string | false> => {
  if (typeof image !== 'string') return false;
  let albumGradient: string | boolean = false;
  await colorThief(image)
    .then((gradient) => (albumGradient = gradient))
    .catch((error) => console.error(error));
  return albumGradient;
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
  let previousState: NowPlayingData = homeState.nowPlaying();
  const fetch = event.fetch as Fetch;

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
            const data = await fetchMediaInfo(fetch);
            console.log('🚀 ~ fetchDataAndEnqueue ~ data:', data);
            // const data = await fetchData(fetch);
            if (data.totalTime && data.relativeTimePosition) {
              refreshInterval =
                timeStringToMilliseconds(data.totalTime) -
                timeStringToMilliseconds(data.relativeTimePosition);
              console.log(
                '⌚️ ~ fetchDataAndEnqueue ~ refreshInterval updated to:',
                refreshInterval
              );
            }
            if (
              (data && previousState?.title !== data.title) ||
              previousState?.loved !== data.loved
            ) {
              const timestamp = Date.now();
              let art: string =
                data.art || previousState.art || '/data/AirplayArtWorkData.png';
              if (previousState.album !== data.album) {
                art = `${art}?ts=${timestamp}`;
              }
              const gradient = await createGradient(art);
              const nowPlaying: NowPlayingData = {
                ...previousState,
                ...data,
                art,
                ...(typeof gradient === 'string' ? { gradient } : {}),
              };
              previousState = nowPlaying;
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
