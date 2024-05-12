import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  precompress: false,
  kit: {
    adapter: adapter({
      precompress: false,
    }),
    alias: {
      $assets: 'static',
      $root: 'src',
      $components: 'src/lib/components',
      $utils: 'src/utils',
    },
  },
};

export default config;
