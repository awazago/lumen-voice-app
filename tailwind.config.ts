// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
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
} satisfies Config;
