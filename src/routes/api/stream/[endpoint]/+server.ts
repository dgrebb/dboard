function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export const GET = async () => {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 20; i++) {
        controller.enqueue(encoder.encode('hello'));
        await delay(1000);
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'content-type': 'text/event-stream',
    },
  });
};
