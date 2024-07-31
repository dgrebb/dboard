/**
 * Checks if the current device supports touch events.
 *
 * @returns {boolean} - True if the device supports touch events, otherwise false.
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
