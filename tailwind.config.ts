/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#52c41a',
        second: '#E7F8FF',
        selected: 'rgba(82,196,26,0.2)',
        inactive: '#84898B',
      },
      textColor: {
        primary: '#52c41a',
        inactive: '#84898B',
      },
      animation: {
        'enter-page': 'slide-in 0.6s ease',
        'snake': 'snake 2s ease-in-out infinite',
      },
      keyframes: {
        'slide-in': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0px)' },
        },
        'snake': {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%, 75%': { transform: 'translateY(-15px)' },
        },
      },
    },
  },
  darkMode: "class",
  plugins: []
};

