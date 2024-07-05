// src/lib/actions/selfOffsetBackground.ts

/**
 * An action that sets the background position of an HTML element based on its offset from the top-left corner of the viewport.
 * The background position is updated on window resize and scroll.
 *
 * @param {HTMLElement} node - The HTML element whose background position needs to be set.
 * @returns {object} An object with a `destroy` method to clean up event listeners when the node is destroyed.
 */
export function selfOffsetBackground(node: HTMLElement): {
  destroy: () => void;
} {
  /**
   * Sets the background position of the element based on its offset from the top-left corner of the viewport.
   */
  const setOffsetBackground = () => {
    const rect = node.getBoundingClientRect();
    const xOffset = -rect.left;
    const yOffset = -rect.top;
    node.style.backgroundPosition = `${xOffset}px ${yOffset}px`;
  };

  // Set the initial offset background after the next frame
  const initializeOffsetBackground = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(setOffsetBackground);
    });
  };

  // Update the background position on window resize and scroll
  window.addEventListener('resize', setOffsetBackground);
  window.addEventListener('scroll', setOffsetBackground, true);

  // Initialize the background position after the component is mounted
  initializeOffsetBackground();

  // Clean up event listeners when the node is destroyed
  return {
    destroy() {
      window.removeEventListener('resize', setOffsetBackground);
      window.removeEventListener('scroll', setOffsetBackground, true);
    },
  };
}
