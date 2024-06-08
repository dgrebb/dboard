import type { StreamsType } from '../types';

export const createStreams = function createStreams() {
  const streams: StreamsType = $state([
    {
      title: 'Stream One',
    },
    {
      title: 'Stream Two',
    },
  ]);

  function addStream(stream: { title: string }) {
    streams.push(stream);
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
