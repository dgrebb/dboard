export * from '$types';

/**
 * A custom fetch function type.
 *
 * @param input - The resource that you wish to fetch.
 * @param init - An options object containing settings like method, headers, etc.
 * @returns A promise that resolves with a Response object.
 */
export type Fetch = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

/**
 * Extended fetch options including custom options.
 */
export interface FetchOptions extends RequestInit {
  customOption?: string;
}

/**
 * Interface for NodeJS errors from SSE
 */
export interface CustomError extends Error {
  code?: string;
}

/**
 * A Timer type that works in both Node.js and browser environments.
 * In Node.js, setTimeout and setInterval return an object with
 * additional methods and properties, while in browsers they return a number.
 */
export type Timer = ReturnType<typeof setTimeout>;

/**
 * A type representing an object or an array.
 */
export type ObjectOrArray = Record<string, unknown> | unknown[];

/**
 * Type representing a stream configuration.
 */
export type StreamType = {
  id: string;
  name: string;
  path: string;
  upstreamAPIURL: string;
  refreshInterval: number;
};

/**
 * Type representing an array of stream configurations.
 */
export type StreamsType = StreamType[];
