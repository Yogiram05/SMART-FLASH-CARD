// Tailwind theme configuration for the purple and indigo dashboard UI.
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        }
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(67, 56, 202, 0.35)'
      },
      backgroundImage: {
        'mesh-glow': 'radial-gradient(circle at top left, rgba(139,92,246,0.22), transparent 28%), radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 24%), radial-gradient(circle at bottom left, rgba(16,185,129,0.12), transparent 22%)'
      }
    }
  },
  plugins: []
};
