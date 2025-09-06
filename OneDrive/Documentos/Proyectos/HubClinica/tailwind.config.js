/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-primary': '#2563eb',
        'medical-secondary': '#64748b',
        'alert-critical': '#dc2626',
        'alert-warning': '#d97706',
        'alert-info': '#2563eb',
      },
    },
  },
  plugins: [],
}