module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* gradient animation */
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },

        /*  slide-right animation */
        'slide-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },

      animation: {
        /*  gradient */
        'gradient-move': 'gradient 10s ease infinite',

        /* slide-right */
        'slide-right': 'slide-right 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
