import type { Component } from 'svelte';

/**
 * A map of component names to their corresponding Svelte components.
 *
 * @type {Record<string, Component<object>>}
 */
const components: Record<string, Component<object>> = {};

/**
 * Dynamically imports all Svelte components in the current directory.
 *
 * The `import.meta.glob` function is used to import all `.svelte` files in the current
 * directory. The imported components are then stored in the `components` object, with
 * the component names (derived from the filenames) as keys.
 */
const componentFiles = import.meta.glob('./*.svelte');

for (const path in componentFiles) {
  const componentName = path.match(/\.\/(.*)\.svelte$/)?.[1];
  if (componentName) {
    componentFiles[path]().then((mod) => {
      components[componentName] = (
        mod as { default: Component<object> }
      ).default;
    });
  }
}

/**
 * Gets the component by name or returns the default component.
 *
 * @param {string | false} componentName - The name of the component to get.
 * @returns {Component<object>} - The Svelte component.
 */
export async function getComponent(
  componentName: string | false
): Promise<Component<object>> {
  if (!componentName || !components[componentName]) {
    const { IconNotFound } = await import('./IconNotFound.svelte');
    return IconNotFound;
  }
  return components[componentName];
}

/**
 * Type representing the available weather icon components.
 */
export type WeatherIconComponent = keyof typeof components;

export default components;