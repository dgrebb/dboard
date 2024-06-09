import { generateID, toCamelCase } from '../_helpers/strings';
import type { StreamsType } from '../types';

export const createStreams = function createStreams() {
  const streams: StreamsType = $state([
    {
      id: 'stream_one',
      name: 'Stream One',
      path: 'streamOne',
      upstreamAPIURL: '',
      refreshInterval: 1000,
    },
    {
      id: 'stream_two',
      name: 'Stream Two',
      path: 'streamTwo',
      upstreamAPIURL: '',
      refreshInterval: 9000,
    },
    {
      id: 'sse',
      name: 'sse',
      path: 'sse',
      upstreamAPIURL: '',
      refreshInterval: 120000,
    },
  ]);

  async function addStream(newStream: {
    name: string;
    refreshInterval: number;
    upstreamAPIURL: string;
  }) {
    const { name, refreshInterval, upstreamAPIURL } = newStream;
    const id = generateID(name);
    const path = toCamelCase(name);
    const stream = {
      ...newStream,
      id,
      name,
      path,
      refreshInterval,
      upstreamAPIURL,
    };
    streams.push(stream);

    // TODO: Refactor for GET with query params
    // await fetch(`/api/stream/${path}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ endpoint: path, refreshInterval }),
    // });
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
