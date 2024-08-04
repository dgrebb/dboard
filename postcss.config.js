import postcssMixins from 'postcss-mixins';
import tailwindcssNesting from 'tailwindcss/nesting/index.js';
import tailwindcss from 'tailwindcss';
import postcssColorFunction from 'postcss-color-function';
import autoprefixer from 'autoprefixer';

const config = {
  plugins: [
    postcssMixins,
    tailwindcssNesting,
    tailwindcss,
    postcssColorFunction,
    autoprefixer,
  ],
};

export default config;
