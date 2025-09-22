import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Mapping your design system to Tailwind
      colors: {
        'primary-bg': '#FFFFFF', // bg-primary
        'secondary-bg': '#F9FAFB', // bg-secondary
        'primary-text': '#111827', // text-primary
        'secondary-text': '#6B7280', // text-secondary
        'inverted-text': '#FFFFFF', // text-inverted
        'interactive-primary': '#000000', // ui-interactive-primary
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Sets the default font
      },
      boxShadow: {
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '2xl': '1rem', // 16px
      }
    },
  },
  plugins: [],
}
export default config
