import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (warning.code === 'element_invalid_self_closing_tag') return;
    if (warning.code.startsWith('css_unused_selector')) return;
    console.log(warning.code);
    handler(warning);
  },
  precompress: false,
  kit: {
    adapter: adapter({
      precompress: false,
    }),
    alias: {
      $actions: 'src/lib/actions',
      $components: 'src/lib/components',
      $layouts: 'src/routes/(layouts)',
      $routes: 'src/routes/',
      $utils: 'src/utils',
      $assets: 'static',
      $root: 'src',
    },
  },
};

export default config;
