import type { StreamsType } from '../types';

export const createStreams = function createStreams() {
  const SSEStreams: StreamsType = $state([
    {
      title: 'Stream One',
    },
    {
      title: 'Stream Two',
    },
  ]);

  function addStream(stream: { title: string }) {
    SSEStreams.push(stream);
  }

  function updateStream(streamId: string) {
    console.log(streamId);
  }

  return {
    get getAll() {
      return SSEStreams;
    },
    addStream,
    updateStream,
  };
};

export const SSEStreams = createStreams();
