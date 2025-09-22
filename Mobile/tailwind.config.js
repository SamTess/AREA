/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{xml,css,scss,js,ts,svelte,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@nativescript/tailwind')],
}
