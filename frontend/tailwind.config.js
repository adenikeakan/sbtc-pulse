/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stacks': '#5546FF',
        'bitcoin': '#F7931A',
      }
    },
  },
  plugins: [],
}