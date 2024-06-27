import type { Fetch, NowPlayingData } from '$lib/types';
import { fetchMediaInfo } from '$utils/wiim';
import type { RequestEvent } from '@sveltejs/kit';
import { colorThief } from '$utils/colorThief';
import { homeState } from '$root/lib/stores';
import { timeStringToMilliseconds, timeStringToSeconds } from '$utils/strings';

export const prerender = false;

let refreshInterval = 1000;

const clients: Set<ReadableStreamDefaultController<Uint8Array>> = new Set();
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

// Broadcast the current state to all clients
const broadcast = (message: Uint8Array) => {
  clients.forEach((client) => {
    try {
      if (client.desiredSize !== null) {
        client.enqueue(message);
      }
    } catch (error) {
      console.error('Error broadcasting to client:', error);
      clients.delete(client);
    }
  });
};

// Send the initial state to a new client
const sendInitialState = async (
  client: ReadableStreamDefaultController<Uint8Array>
) => {
  try {
    const data = await fetchMediaInfo(fetch);
    const state = {
      ...previousState,
      ...data,
    };
    const stream = `data: ${JSON.stringify(state)}\n\n`;
    if (client.desiredSize !== null) {
      client.enqueue(new TextEncoder().encode(stream));
    }
  } catch (error) {
    console.error('Error sending initial state to client:', error);
    clients.delete(client);
  }
};

const startInterval = (fetch: Fetch) => {
  if (interval) return;

  interval = setInterval(async () => {
    try {
      const data = await fetchMediaInfo(fetch);
      const { totalTime, relativeTimePosition } = data;
      const total: number = timeStringToSeconds(totalTime);
      const relative: number = timeStringToSeconds(relativeTimePosition);
      if (total && relative) {
        refreshInterval = total;
      }
      if (
        ((data && previousState?.title !== data.title) ||
          previousState?.loved !== data.loved) &&
        timeStringToSeconds(data.relativeTimePosition) < 30
      ) {
        const timestamp = Date.now();
        let art: string =
          data.art || previousState.art || '/data/AirplayArtWorkData.png';
        if (previousState.album !== data.album) {
          console.log('art changed');
          art = `${art}?ts=${timestamp}`;
        }

        const ipPattern =
          /^(https?:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/[^\n?#]*)?(\?[^\n#]*)?(#.*)?$/;
        const match = art.match(ipPattern);
        if (match) {
          const path = match[4] || '';
          const query = match[5] || '';
          art = `${path}${query}`;
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

export const GET = async (event: RequestEvent) => {
  const fetch = event.fetch as Fetch;

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Send initial state to the new client
      await sendInitialState(controller);

      clients.add(controller);

      const cleanup = () => {
        clients.delete(controller);
        if (clients.size === 0 && interval) {
          clearInterval(interval);
          interval = null;
        }
      };

      // Handle client disconnection
      event.request.signal.addEventListener('abort', cleanup);

      if (clients.size === 1) {
        startInterval(fetch);
      }
    },
    cancel() {
      clients.forEach((client) => {
        if (client.desiredSize === null) {
          clients.delete(client);
        }
      });
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
