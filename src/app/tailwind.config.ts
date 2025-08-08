// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-poppins)'],
      },
      colors: {
        'gray-deep': '#121212',
        'gray-mid': '#1A1A1A',
        'gray-light': '#A0A0A0',
        'primary-blue': '#007BFF',
        'accent-purple': '#8A2BE2',
        'accent-magenta': '#E000B2',
      },
    },
  },
  plugins: [],
};
export default config;