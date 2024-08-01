import type { CalendarEvent } from '@widgets/Schedule/Schedule.types';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

/**
 * Handles GET requests to fetch and filter event data.
 *
 * @param {Object} request - The request object.
 * @param {Function} fetch - The fetch function to make network requests.
 * @param {URL} url - The URL object representing the request URL.
 * @returns {Promise<Response>} A JSON response containing filtered events.
 */
export const GET: RequestHandler = async ({ fetch, url }) => {
  const eventRange = url.searchParams.get('range');
  const source = await fetch(`/${eventRange}.json`);
  const events: CalendarEvent[] = JSON.parse(await source.text());

  // Filter out events with duration >= 120 that are of the "calendar": "Calendar" type
  const filteredEvents = events.filter(
    (event) => !(event.calendar === 'Calendar' && event.duration >= 120)
  );

  return json({ success: true, events: filteredEvents });
};
