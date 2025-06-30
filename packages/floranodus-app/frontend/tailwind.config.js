export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'floranodus': {
          'bg-primary': '#0a0a0a',
          'bg-secondary': '#141414',
          'bg-tertiary': '#1e1e1e',
          'border': '#2a2a2a',
          'text-primary': '#ffffff',
          'text-secondary': '#a8a8a8',
          'accent-primary': '#4a9eff',
          'accent-secondary': '#00d4ff',
          'success': '#4ade80',
          'warning': '#fbbf24',
          'error': '#ef4444'
        }
      }
    }
  },
  plugins: [],
} 