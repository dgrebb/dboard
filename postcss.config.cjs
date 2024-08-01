const config = {
  plugins: [
    require('postcss-mixins'), // Ensure mixins are processed first
    require('tailwindcss/nesting'), // Process nesting rules
    require('tailwindcss'), // TailwindCSS to handle @apply and other directives
    require('postcss-color-function'), // Handle color functions
    require('autoprefixer'), // Add vendor prefixes for compatibility
  ],
};

module.exports = config;
