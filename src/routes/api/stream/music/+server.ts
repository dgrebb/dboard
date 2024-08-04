import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type {
  CustomError,
  Fetch,
  FetchOptions,
  GradientResult,
  NowPlayingAPI,
  NowPlayingData,
  Timer,
} from '@types';
import { SECRET_AUDIO_CONTROL_IP_ADDRESS } from '$env/static/private';
import { colorThief } from '@utils/colorThief';
import { timeStringToSeconds } from '@utils/strings';
import { fetchMediaInfo } from '@utils/wiim';

export const prerender = false;

let refreshInterval = 1000; // 1 second
let retryTimeout: number | undefined;
let retryCount = 0;

const clients = new Set<{
  controller: ReadableStreamDefaultController<Uint8Array>;
  isClosed: boolean;
  ip: string;
}>();
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

/**
 * Creates a gradient from the provided image URL.
 * @param {string} image - The image URL.
 * @returns {Promise<GradientResult | boolean>} - The gradient result or false if an error occurs.
 */
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

/**
 * Broadcasts a message to all connected clients.
 * @param {Uint8Array} message - The message to broadcast.
 */
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

/**
 * Sends the initial state to a new client.
 * @param {ReadableStreamDefaultController<Uint8Array>} controller - The stream controller.
 * @param {Fetch} fetch - The fetch function.
 */
const sendInitialState = async (
  controller: ReadableStreamDefaultController<Uint8Array>,
  fetch: Fetch
) => {
  try {
    const data = await fetchMediaInfo(fetch);
    const state = { ...previousState, ...data };
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

/**
 * Fetches the loved status of the current track.
 * @param {Fetch} fetch - The fetch function.
 * @param {NowPlayingAPI} wiiMData - The current track data.
 * @returns {Promise<boolean>} - The loved status.
 */
const fetchLovedStatus = async (
  fetch: Fetch,
  wiiMData: NowPlayingAPI
): Promise<boolean> => {
  const maxAttempts = 2; // Reduce number of attempts to 2
  let attempt = 0;

  const tryFetch = async (): Promise<boolean> => {
    attempt++;
    if (attempt > maxAttempts) return false;

    try {
      const response = await fetch('/api/static/music');
      const text = await response.text();
      const data = JSON.parse(text);

      if (
        data.artist === wiiMData.artist &&
        data.album === wiiMData.album &&
        data.title === wiiMData.title
      ) {
        const stream = `data: ${JSON.stringify({ loved: data.loved })}\n\n`;
        broadcast(new TextEncoder().encode(stream));
        return data.loved;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Reduce wait time to 10 seconds
        return tryFetch();
      }
    } catch (error) {
      console.error('Error fetching favorite status:', error);
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Reduce wait time to 10 seconds
      return tryFetch();
    }
  };

  return tryFetch();
};

/**
 * Processes the media information and broadcasts updates if necessary.
 * @param {Fetch} fetch - The fetch function.
 */
const processMediaInfo = async (fetch: Fetch) => {
  try {
    let data = await fetchMediaInfo(fetch);

    // return if track is unchanged
    if (previousState?.title === data.title && data.title !== '') return;

    if (!data.art) {
      const retryData = await fetchMediaInfo(fetch);
      if (retryData.art) data = retryData;
    }
    const { totalTime, relativeTimePosition } = data;
    const total = timeStringToSeconds(totalTime);
    const relative = timeStringToSeconds(relativeTimePosition);

    if (total && relative) refreshInterval = total;

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

    previousState = nowPlaying;
    const stream = `data: ${JSON.stringify(nowPlaying)}\n\n`;
    broadcast(new TextEncoder().encode(stream));
    await fetchLovedStatus(fetch, data);
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
};

/**
 * Starts the interval for fetching and broadcasting media information.
 * @param {Fetch} fetch - The fetch function.
 */
const startInterval = (fetch: Fetch): void => {
  if (interval) return;
  interval = setInterval(() => processMediaInfo(fetch), refreshInterval);
};

/**
 * Handles a player command by sending it to the audio control API.
 * @param {string} command - The player command.
 * @param {Fetch} fetch - The fetch function.
 */
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

/**
 * Handles gradient generation for the current track's artwork.
 * @returns {Promise<GradientResult | boolean>} - The gradient result or false if an error occurs.
 */
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
