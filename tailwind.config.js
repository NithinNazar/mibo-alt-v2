/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        miboGreen: '#1B4332',
        miboLightGreen: '#D8F3DC',
        miboDark: '#081C15',
        miboText: '#2D2D2D',
        miboAccent: '#52B788', // soft secondary tone for hover/highlight
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        expertiseScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        expertiseScroll: 'expertiseScroll 15s linear infinite',
      },
    },
  },
  plugins: [],
};



// export default {
//     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//     theme: {
//         extend: {
//              keyframes: {
//         fadeIn: {
//           '0%': { opacity: 0, transform: 'translateY(20px)' },
//           '100%': { opacity: 1, transform: 'translateY(0)' },
//         },
//       },
//       animation: {
//         fadeIn: 'fadeIn 1s ease-out forwards',
//       },
//         },
//     },
//     plugins: [],
// };
