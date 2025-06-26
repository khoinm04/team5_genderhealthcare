/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'group-hover:opacity-100',
    'group-hover:pointer-events-auto',
    'pointer-events-none',
    'transition-opacity',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
