import { generateID, toCamelCase } from '../_helpers/strings';
import type { StreamsType } from '../types';

export const createStreams = function createStreams() {
  const streams: StreamsType = $state([
    {
      id: 'stream_one',
      title: 'Stream One',
      path: 'streamOne',
      interval: 1000,
    },
    {
      id: 'stream_two',
      title: 'Stream Two',
      path: 'streamTwo',
      interval: 9000,
    },
    {
      id: 'sse',
      title: 'sse',
      path: 'sse',
      interval: 120000,
    },
  ]);

  async function addStream(newStream: { title: string; interval: number }) {
    const { title, interval } = newStream;
    const id = generateID(title);
    const path = toCamelCase(title);
    const stream = {
      ...newStream,
      id,
      title,
      path,
      interval,
    };
    streams.push(stream);

    await fetch(`/api/stream/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: path, interval }),
    });
    return path;
  }

  function updateStream(streamId: string) {
    console.log(streamId);
  }

  return {
    get getAll() {
      return streams;
    },
    addStream,
    updateStream,
  };
};

export const streams = createStreams();
