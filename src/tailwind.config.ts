import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color: Deep Teal
        primary: {
          DEFAULT: '#1A5F7A',
          light: '#2A8FB0',
          dark: '#0F3A4A',
          50: 'rgba(26, 95, 122, 0.1)',
          100: 'rgba(26, 95, 122, 0.25)',
          200: 'rgba(26, 95, 122, 0.5)',
          300: 'rgba(26, 95, 122, 0.75)',
        },
        // Secondary Color: Warm Terracotta
        secondary: {
          DEFAULT: '#E27D60',
          light: '#F49880',
          dark: '#C45A40',
        },
        // Accent Color: Gold/Amber
        accent: {
          DEFAULT: '#FFC857',
          light: '#FFD87A',
          dark: '#E6AE32',
        },
        // Neutrals
        neutral: {
          white: '#FFFFFF',
          'off-white': '#F8F9FA',
          'light-gray': '#E9ECEF',
          'medium-gray': '#ADB5BD',
          'dark-gray': '#343A40',
          charcoal: '#212529',
        },
        // Semantic Colors
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'h1': ['36px', { lineHeight: '44px', letterSpacing: '-0.5px', fontWeight: '700' }],
        'h2': ['30px', { lineHeight: '38px', letterSpacing: '-0.25px', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '32px', letterSpacing: '0', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '28px', letterSpacing: '0', fontWeight: '600' }],
        'h5': ['18px', { lineHeight: '26px', letterSpacing: '0', fontWeight: '500' }],
        'h6': ['16px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
    },
  },
  plugins: [],
};
export default config;