import type { Fetch, FetchOptions, NowPlayingData } from '$root/lib/types';
import { fetchMediaInfo } from '$utils/wiim';
import { json, type RequestEvent } from '@sveltejs/kit';
import { colorThief } from '$utils/colorThief';
import { homeState } from '$root/lib/stores';
import { timeStringToMilliseconds } from '$utils/strings';

export const prerender = false;

const URL = '/api/v1/music';
let refreshInterval = 1000;
const requestOptions: FetchOptions = {
  method: 'GET',
  redirect: 'follow',
};

let clients: Set<ReadableStreamDefaultController<Uint8Array>> = new Set();
let interval: NodeJS.Timeout | null = null;
let previousState: NowPlayingData = homeState.nowPlaying();

const createGradient = async (image: string): Promise<string | false> => {
  if (typeof image !== 'string') return false;
  let albumGradient: string | boolean = false;
  await colorThief(image)
    .then((gradient) => (albumGradient = gradient))
    .catch((error) => console.error(error));
  return albumGradient;
};

// TODO: remove legacy music API
// const fetchData = async (fetch: Fetch): Promise<NowPlayingData> => {
//   try {
//     const response = await fetch(URL, requestOptions);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };

const startInterval = (fetch: Fetch) => {
  if (interval) return;

  interval = setInterval(async () => {
    try {
      const data = await fetchMediaInfo(fetch);
      if (data.totalTime && data.relativeTimePosition) {
        refreshInterval =
          timeStringToMilliseconds(data.totalTime) -
          timeStringToMilliseconds(data.relativeTimePosition);
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
        broadcast(new TextEncoder().encode(stream));
      }
    } catch (error) {
      console.error('Error fetching or broadcasting data:', error);
    }
  }, refreshInterval);
};

const broadcast = (message: Uint8Array) => {
  clients.forEach((client) => {
    try {
      client.enqueue(message);
    } catch (error) {
      console.error('Error broadcasting to client:', error);
      clients.delete(client);
    }
  });
};

export const GET = async (event: RequestEvent) => {
  const fetch = event.fetch as Fetch;

  const readable = new ReadableStream({
    start(controller) {
      clients.add(controller);

      const cleanup = () => {
        clients.delete(controller);
      };

      // Handle client disconnection
      event.request.signal.addEventListener('abort', cleanup);

      if (clients.size === 1) {
        startInterval(fetch);
      }
    },
    cancel() {
      clients.delete(readable.getReader());
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
};
