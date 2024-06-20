import type { Fetch, FetchOptions, NowPlayingData } from '$root/lib/types';
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

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const fetchDataAndEnqueue = async (fetch: Fetch) => {
          try {
            const timestamp = Date.now();
            const data = await fetchData(fetch);
            if (data && current?.title !== data.title) {
              const nowPlaying: NowPlayingData = {
                ...data,
                art: `/album_art.png?ts=${timestamp}`,
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

// const requestOptions: FetchOptions = {
//   method: 'GET',
//   redirect: 'follow',
// };

// TODO: Create SSE Server
// const refreshInterval = 5000; // Interval in milliseconds to check for updates
// let refreshTimer: NodeJS.Timeout; // Timer to periodically check for updates
// let previousContent: string | null = null; // Previous file content
// let timestamp = 0; // Initial timestamp value
// let art = '/album_art.png';
// let title = '';
// let album = '';
// let artist = '';

// TODO: pollfile function
// const pollFile = async () => {
//   try {
//     timestamp = Date.now(); // Update the timestamp for each poll
//     const response = await fetch(`/album_art.png?_=${timestamp}`);
//     if (response.ok) {
//       const currentContent = await response.text();
//       if (currentContent !== previousContent) {
//         previousContent = currentContent; // Update the previous file content
//         art = `/album_art.png?_=${timestamp}`;
//         const music = await fetch('/api/v1/music');
//         ({ album, title, artist } = await music.json());
//         const nowPlaying = {
//           artist,
//           title,
//           album,
//           art,
//         };
//         homeStore.nowPlaying = nowPlaying;
//       }
//     } else {
//       art = ''; // Clear the file path if the file does not exist
//       previousContent = null; // Reset previous file content
//     }
//   } catch (error) {
//     console.error('Error polling file:', error);
//   } finally {
//     refreshTimer = setTimeout(pollFile, refreshInterval); // Schedule the next poll
//   }
// };

// // TODO: music api call and seting art, album, title, and artist on album art file change

// // TODO: on disconnect; kill pollfile timer
// clearInterval(refreshTimer); // Clear the timer when the component is destroyed
