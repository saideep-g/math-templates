/** @type {import('tailwindcss').Config} */
export default {
  /**
   * The 'content' array is the most important part of the config.
   * It tells Tailwind to look at your HTML and all TypeScript/React files
   * in the 'src' folder to find class names like 'bg-indigo-600' or 'p-8'.
   */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /**
       * You can extend the default theme here (e.g., custom colors),
       * but the default Tailwind palette works perfectly for our 
       * Class 7 math app aesthetic.
       */
    },
  },
  plugins: [],
}