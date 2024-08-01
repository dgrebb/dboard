const config = {
  plugins: [
    require('postcss-mixins'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('postcss-color-function'),
    require('autoprefixer'),
  ],
};

module.exports = config;
