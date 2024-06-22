const config = {
  plugins: [
    require('postcss-mixins'), // Process mixins first
    require('tailwindcss/nesting'), // Then handle nesting
    require('tailwindcss'), // TailwindCSS should be processed after nesting
    require('postcss-color-function'), // Then color functions
    require('autoprefixer'), // Finally, add vendor prefixes
  ],
};

module.exports = config;
