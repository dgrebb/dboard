import type { Fetch, GradientResult, NowPlayingData, Timer } from '$lib/types';
import { homeState } from '$lib/stores';
import { colorThief } from '$utils/colorThief';
import { timeStringToSeconds } from '$utils/strings';
import { fetchMediaInfo } from '$utils/wiim';
import type { RequestEvent } from '@sveltejs/kit';

export const prerender = false;

/**
 * Refresh interval for fetching data.
 */
let refreshInterval: number = 1000; // 1 second

/**
 * Timeout ID for retrying fetch on error.
 */
let retryTimeout: number | undefined;

/**
 * Retry count for exponential backoff.
 */
let retryCount = 0;

const clients: Set<{
  controller: ReadableStreamDefaultController<Uint8Array>;
  isClosed: boolean;
  ip: string;
}> = new Set();
let interval: Timer | null = null;
let previousState: NowPlayingData = homeState.nowPlaying();

// Log the clients in a tabular format

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logClients = () => {
  const clientArray = Array.from(clients).map((client) => ({
    ip: client.ip,
    isClosed: client.isClosed,
  }));
  console.table(clientArray);
};

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
      if (!client.isClosed) {
        client.controller.enqueue(message);
      }
    } catch (error) {
      console.error(`Error broadcasting to client ${client.ip}:`, error);
      client.isClosed = true;
      clients.delete(client);
    }
  });
};

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
    clients.forEach((c) => {
      if (c.controller === client) {
        c.isClosed = true;
      }
    });
  }
};

/**
 * Starts the interval for fetching and broadcasting media information.
 * @param fetch - The fetch function to use for the API requests.
 */
const startInterval = (fetch: Fetch): void => {
  if (interval) return;

  interval = setInterval(async () => {
    try {
      // Fetch data from the API
      let data = await fetchMediaInfo(fetch);

      // Retry if art is empty
      if (!data.art) {
        const retryData = await fetchMediaInfo(fetch);
        if (retryData.art) data = retryData;
      }

      const { totalTime, relativeTimePosition } = data;
      const total = timeStringToSeconds(totalTime);
      const relative = timeStringToSeconds(relativeTimePosition);

      // Update refresh interval
      if (total && relative) refreshInterval = total;

      const shouldBroadcast =
        (data && previousState?.title !== data.title) ||
        (previousState?.loved !== data.loved && relative < 30);

      if (shouldBroadcast) {
        const timestamp = Date.now();

        let art = data.art || '/missing-album-art.png';

        // Store the unaltered image source URL
        const gradientArt = art;

        // NOTE: Proxying image URL is currently blocked by SSE mishandling
        // TODO: Fix image-blocking SSE
        // Proxy insecure WiiM Certificate URL
        const ipAddressPattern =
          /^(https?:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/;
        art = art.includes('/data/AirplayArtWorkData.png')
          ? art.replace(ipAddressPattern, '')
          : art;

        if (previousState?.album !== data.album) {
          art = `${art}?ts=${timestamp}`;
        }

        let backgroundGradient: string | undefined;
        let foregroundGradient: string | undefined;

        // Create gradient if the title has changed
        if (previousState?.title !== data.title) {
          const gradientResult = await createGradient(gradientArt);
          if (gradientResult && typeof gradientResult !== 'boolean') {
            ({ backgroundGradient, foregroundGradient } = gradientResult);
          }
        }

        // Prepare now playing data
        const nowPlaying: NowPlayingData = {
          ...previousState,
          ...data,
          art,
          ...(backgroundGradient ? { backgroundGradient } : {}),
          ...(foregroundGradient ? { foregroundGradient } : {}),
        };

        // Broadcast the now playing data
        const stream = `data: ${JSON.stringify(nowPlaying)}\n\n`;
        broadcast(new TextEncoder().encode(stream));
        previousState = nowPlaying;
      }
    } catch (error) {
      console.error('Error fetching or broadcasting data:', error);

      // Retry connection with exponential backoff
      retryCount++;
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000);
      if (retryTimeout) clearTimeout(retryTimeout);
      retryTimeout = setTimeout(
        () => startInterval(fetch),
        retryDelay
      ) as unknown as number;
    }
  }, refreshInterval);
};

export const GET = async (event: RequestEvent) => {
  const fetch = event.fetch as Fetch;
  const clientIp = event.getClientAddress();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Send initial state to the new client
      await sendInitialState(controller);

      clients.add({ controller, isClosed: false, ip: clientIp });

      // Print the client list on new connections
      // console.info('------------------ CLIENT LIST -----------------');
      // logClients();

      const cleanup = () => {
        const client = Array.from(clients).find(
          (c) => c.controller === controller
        );
        if (client) {
          client.isClosed = true;
          clients.delete(client);
        }
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
        if (client.controller.desiredSize === null) {
          client.isClosed = true;
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
