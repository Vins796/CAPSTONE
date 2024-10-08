/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: ["light", "black"],
  },
  theme: {
    extend: {},
    fontFamily: {
      'montserrat': ["Montserrat", 'sans-serif'],
      'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      'poppins': ['Poppins', 'sans-serif'],
      'inter': ['Inter Tight', 'sans-serif'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['Oswald'],
      'body': ['"Open Sans"'],
    }
  },
  plugins: [require('daisyui'),],
}

