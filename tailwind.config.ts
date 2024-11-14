import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50':  '#eef7ff',
          '100': '#d9edff',
          '200': '#bce0ff',
          '300': '#8acbff',
          '400': '#51adff',
          '500': '#2b89ff',
          '600': '#1a6cf5',
          '700': '#1655e2',
          '800': '#1946b7',
          '900': '#1b3d8f',
        },
        'secondary': {
          '50':  '#f8f9fa',
          '100': '#ebedf0',
          '200': '#d4d8dd',
          '300': '#b0b7c2',
          '400': '#8791a1',
          '500': '#6b7787',
          '600': '#565f6d',
          '700': '#474e59',
          '800': '#3d424b',
          '900': '#363a41',
        }
      },
    },
  },
  plugins: [],
}

export default config
