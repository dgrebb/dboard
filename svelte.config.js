import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (warning.code === 'element_invalid_self_closing_tag') return;
    if (warning.code.startsWith('css_unused_selector')) return;
    console.info(warning.code);
    handler(warning);
  },
  precompress: false,
  kit: {
    adapter: adapter({
      precompress: false,
    }),
    alias: {
      $lib: 'src/lib',
      '@utils': 'src/lib/utils',
      utils: '@utils',
      '@actions': 'src/lib/actions',
      '@widgets': 'src/lib/widgets',
      '@routes': 'src/routes/',
      '@components': 'src/lib/components',
      '@layouts': 'src/routes/(layouts)',
      '@assets': 'static',
      '@root': 'src',
      '@types': 'src/lib/types',
      '@guards': 'src/lib/utils/guards',
      '@stores': 'src/lib/stores',
    },
  },
};

export default config;
