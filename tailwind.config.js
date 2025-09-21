/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220, 10%, 15%)',
        accent: 'hsl(160, 70%, 35%)',
        danger: 'hsl(0, 80%, 50%)',
        primary: 'hsl(200, 90%, 40%)',
        success: 'hsl(140, 60%, 40%)',
        surface: 'hsl(220, 10%, 20%)',
        warning: 'hsl(40, 90%, 50%)',
        'text-primary': 'hsl(0, 0%, 95%)',
        'text-secondary': 'hsl(0, 0%, 60%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(0, 0%, 0%, 0.2)',
        'modal': '0 8px 32px hsla(0, 0%, 0%, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}