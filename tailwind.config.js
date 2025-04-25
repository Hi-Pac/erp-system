module.exports = {
    darkMode: 'class',
    content: [
      './src/**/*.{html,js}',
      './public/**/*.html',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#5D5CDE', // Main brand color
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
        },
        fontFamily: {
          'sans': ['Cairo', 'sans-serif'],
        },
        boxShadow: {
          'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        },
        height: {
          'screen-90': '90vh',
        },
      },
    },
    plugins: [],
  }