import type { Fetch, GradientResult, NowPlayingData } from '$lib/types';
import { homeState } from '$lib/stores';
import { colorThief } from '$utils/colorThief';
import { timeStringToSeconds } from '$utils/strings';
import { fetchMediaInfo } from '$utils/wiim';
import type { RequestEvent } from '@sveltejs/kit';

export const prerender = false;

let refreshInterval = 1000;

const clients: Set<ReadableStreamDefaultController<Uint8Array>> = new Set();
let interval: NodeJS.Timeout | null = null;
let previousState: NowPlayingData = homeState.nowPlaying();

const createGradient = async (
  image: string
): Promise<GradientResult | boolean> => {
  if (typeof image !== 'string') return false;

  try {
    const gradientResult = await colorThief(image);
    let backgroundGradient: string | undefined;
    let foregroundGradient: string | undefined;

    if (gradientResult && typeof gradientResult !== 'boolean') {
      ({ backgroundGradient, foregroundGradient } = gradientResult);
    }

    return {
      backgroundGradient: backgroundGradient || '',
      foregroundGradient: foregroundGradient || '',
    };
  } catch (error) {
    console.error('Error creating gradient:', error);
    return false;
  }
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
      let gradientResult: GradientResult | boolean;
      const data = await fetchMediaInfo(fetch);
      const { totalTime, relativeTimePosition } = data;
      const total = timeStringToSeconds(totalTime);
      const relative = timeStringToSeconds(relativeTimePosition);
      if (total && relative) {
        refreshInterval = total;
      }
      const shouldBroadcast =
        (data && previousState?.title !== data.title) ||
        (previousState?.loved !== data.loved && relative < 30);

      if (shouldBroadcast) {
        const timestamp = Date.now();
        let art = data.art || '/missing-album-art.png';
        let backgroundGradient: string | undefined;
        let foregroundGradient: string | undefined;

        if (previousState.album !== data.album) {
          art = `${art}?ts=${timestamp}`;
        }

        if (previousState.title !== data.title) {
          gradientResult = (await createGradient(art)) || false;

          if (gradientResult && typeof gradientResult !== 'boolean') {
            ({ backgroundGradient, foregroundGradient } = gradientResult);
          }
        }

        const nowPlaying: NowPlayingData = {
          ...previousState,
          ...data,
          art,
          ...(typeof backgroundGradient === 'string'
            ? { backgroundGradient }
            : {}),
          ...(typeof foregroundGradient === 'string'
            ? { foregroundGradient }
            : {}),
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
