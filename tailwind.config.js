// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'display': ['Sora', ...defaultTheme.fontFamily.sans],
        'body': ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
