
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {luxury : {
          ...require("daisyui/src/theming/themes")["luxury"],
          primary: "#F3A326",
          // secondary: "#F3A326",
          // accent: "#F3A326",
          // neutral: "#F3A326",
        },}
      ]
  }
}