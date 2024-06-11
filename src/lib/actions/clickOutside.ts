/**
 * An action that detects clicks outside of the given DOM node and dispatches a custom `outsideclick` event.
 *
 * @param {HTMLElement} node - The DOM node to detect outside clicks on.
 * @returns {Object} An object with a destroy method to remove the event listener.
 */
export function clickOutside(node: HTMLElement): { destroy(): void } {
  /**
   * Handles click events and dispatches the `outsideclick` event if the click occurred outside the node.
   *
   * @param {MouseEvent} event - The click event.
   */
  function handleClick(event: MouseEvent): void {
    if (!node.contains(event.target as Node)) {
      node.dispatchEvent(new CustomEvent('outsideclick'));
    }
  }

  // Add the click event listener to the window
  window.addEventListener('click', handleClick);

  return {
    /**
     * Removes the click event listener from the window.
     */
    destroy() {
      window.removeEventListener('click', handleClick);
    },
  };
}
