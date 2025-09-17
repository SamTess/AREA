/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './navigation/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: 'purple',
        danger: 'crimson',
        text: '#222',
        muted: '#777',
        background: '#ffffffff',
        error: 'red',
        // dark variants
        'background-dark': '#1d1f21',
        'text-dark': '#f5f5f5',
        'muted-dark': '#999999',
      },
    },
  },
  plugins: [],
};