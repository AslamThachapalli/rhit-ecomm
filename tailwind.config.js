import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'auth-bg': "url('/images/auth-page-bg-img.png')",
      },
      keyframes: {
        'slide-in-left': {
          '0%': {transform: 'translateX(100%)'},
          '100%': {transform: 'translateX(0)'},
        }
      },
      animation: {
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
})

