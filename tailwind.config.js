// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // --- CHOOSE YOUR OPTION ---

        // == Option 1: Elegant & Premium ==
        'display': ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
        'body': ['Lato', ...defaultTheme.fontFamily.sans],

        // == Option 2: Modern & Stylish (The "Yarnity" approach) ==
        // 'display': ['Syne', ...defaultTheme.fontFamily.sans],
        // 'body': ['Inter', ...defaultTheme.fontFamily.sans],

        // == Option 3: Refined & Personal ==
        // 'display': ['"Cormorant Garamond"', ...defaultTheme.fontFamily.serif],
        // 'body': ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
  // ...rest of your config
};