module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8300e9',
        accent: '#0077ff',
        success: '#8adb00',
        'panel-dark': '#f5f7fa',
        surface: '#ffffff',
        'border-light': '#e5e7eb',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
