import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type {
  CustomError,
  Fetch,
  FetchOptions,
  GradientResult,
  NowPlayingData,
  Timer,
} from '$lib/types';
import { SECRET_AUDIO_CONTROL_IP_ADDRESS } from '$env/static/private';
import { colorThief } from '$utils/colorThief';
import { timeStringToSeconds } from '$utils/strings';
import { fetchMediaInfo } from '$utils/wiim';

export const prerender = false;

let refreshInterval: number = 1000; // 1 second
let retryTimeout: number | undefined;
let retryCount = 0;

const clients: Set<{
  controller: ReadableStreamDefaultController<Uint8Array>;
  isClosed: boolean;
  ip: string;
}> = new Set();
let interval: Timer | null = null;
let previousState: NowPlayingData = {
  artist: '',
  album: '',
  title: '',
  art: '',
  totalTime: '',
  relativeTimePosition: '',
  loved: false,
  backgroundGradient: '',
  foregroundGradient: '',
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
      if ((error as CustomError).code === 'ERR_INVALID_STATE') {
        console.warn('Attempted to use a closed controller');
        client.isClosed = true;
        clients.delete(client);
      } else {
        console.error(`Error broadcasting to client ${client.ip}:`, error);
        client.isClosed = true;
        clients.delete(client);
      }
    }
  });
};

const sendInitialState = async (
  controller: ReadableStreamDefaultController<Uint8Array>,
  fetch: Fetch
) => {
  try {
    const data = await fetchMediaInfo(fetch);
    const state = {
      ...previousState,
      ...data,
    };
    const stream = `data: ${JSON.stringify(state)}\n\n`;
    if (controller.desiredSize !== null) {
      controller.enqueue(new TextEncoder().encode(stream));
    }
  } catch (error) {
    console.error('Error sending initial state to client:', error);
    clients.forEach((c) => {
      if (c.controller === controller) {
        c.isClosed = true;
      }
    });
  }
};

const startInterval = (fetch: Fetch): void => {
  if (interval) return;

  interval = setInterval(async () => {
    try {
      let data = await fetchMediaInfo(fetch);

      if (!data.art) {
        const retryData = await fetchMediaInfo(fetch);
        if (retryData.art) data = retryData;
      }

      const { totalTime, relativeTimePosition } = data;
      const total = timeStringToSeconds(totalTime);
      const relative = timeStringToSeconds(relativeTimePosition);

      if (total && relative) refreshInterval = total;

      const shouldBroadcast =
        (data && previousState?.title !== data.title) ||
        (previousState?.loved !== data.loved && relative < 30);

      if (shouldBroadcast) {
        const timestamp = Date.now();

        let art = data.art || '/missing-album-art.png';
        const gradientArt = art;

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

        if (previousState?.title !== data.title) {
          const gradientResult = await createGradient(gradientArt);
          if (gradientResult && typeof gradientResult !== 'boolean') {
            ({ backgroundGradient, foregroundGradient } = gradientResult);
          }
        }

        const nowPlaying: NowPlayingData = {
          ...previousState,
          ...data,
          art,
          ...(backgroundGradient ? { backgroundGradient } : {}),
          ...(foregroundGradient ? { foregroundGradient } : {}),
        };

        const stream = `data: ${JSON.stringify(nowPlaying)}\n\n`;
        broadcast(new TextEncoder().encode(stream));
        previousState = nowPlaying;
      }
    } catch (error) {
      console.error('Error fetching or broadcasting data:', error);
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

const handlePlayerCommand = async (
  command: string,
  fetch: Fetch
): Promise<void> => {
  const requestOptions: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  await fetch(
    `https://${SECRET_AUDIO_CONTROL_IP_ADDRESS}/httpapi.asp?command=setPlayerCmd:${command}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.info(result))
    .catch((error) => console.error(error));

  // Fetch updated media info and broadcast to clients
  const data = await fetchMediaInfo(fetch);

  let art = data.art || '/missing-album-art.png';
  const timestamp = Date.now();
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

  if (previousState?.title !== data.title) {
    const gradientResult = await createGradient(art);
    if (gradientResult && typeof gradientResult !== 'boolean') {
      ({ backgroundGradient, foregroundGradient } = gradientResult);
    }
  }

  const nowPlaying: NowPlayingData = {
    ...previousState,
    ...data,
    art,
    ...(backgroundGradient ? { backgroundGradient } : {}),
    ...(foregroundGradient ? { foregroundGradient } : {}),
  };

  previousState = nowPlaying;

  const stream = `data: ${JSON.stringify(nowPlaying)}\n\n`;
  broadcast(new TextEncoder().encode(stream));
};

const handleGradientGeneration = async (): Promise<
  GradientResult | boolean
> => {
  try {
    const gradientResult = await createGradient(previousState.art);
    if (gradientResult && typeof gradientResult !== 'boolean') {
      previousState.backgroundGradient =
        gradientResult.backgroundGradient || '';
      previousState.foregroundGradient =
        gradientResult.foregroundGradient || '';

      // Broadcast the new gradient to all clients
      const message = JSON.stringify({
        backgroundGradient: previousState.backgroundGradient,
        foregroundGradient: previousState.foregroundGradient,
      });
      broadcast(new TextEncoder().encode(`data: ${message}\n\n`));

      return gradientResult;
    }
    return false;
  } catch (error) {
    console.error('Error generating gradient:', error);
    return false;
  }
};

export const GET: RequestHandler = async (event: RequestEvent) => {
  const fetch = event.fetch as Fetch;
  const clientIp = event.getClientAddress();
  const command = event.url.searchParams.get('command');
  const generateGradient = event.url.searchParams.get('generateGradient');

  if (command) {
    // Handle the command and return the result
    await handlePlayerCommand(command, fetch);
    return json({ success: true });
  }

  if (generateGradient) {
    const gradient = await handleGradientGeneration();
    if (gradient) {
      return json({ success: true, gradient });
    } else {
      return json({ success: false, message: 'Failed to generate gradient' });
    }
  }

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      await sendInitialState(controller, fetch);
      clients.add({ controller, isClosed: false, ip: clientIp });

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

export const POST: RequestHandler = async ({ fetch, url }) => {
  const command = url.searchParams.get('command');
  if (command) {
    await handlePlayerCommand(command, fetch);
    return json({ success: true });
  }
  return json({ success: false, message: 'No command provided' });
};
