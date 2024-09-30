const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.ejs',
    './src/**/*.js',
    './src/views/*.ejs',
    './src/views/partials/*.ejs',
    './public/**/*.html',
    './public/**/*.js',
  ],
  theme: {
    screens: {
      'sm': '640px',

      'md': '768px',

      'lg': '1024px',

      'xl': '1280px',

      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(222.2, 47.4%, 11.2%)',
        muted: 'hsl(210, 40%, 96.1%)',
        'muted-foreground': 'hsl(215.4, 16.3%, 46.9%)',
        popover: 'hsl(0, 0%, 100%)',
        'popover-foreground': 'hsl(222.2, 47.4%, 11.2%)',
        border: 'hsl(214.3, 31.8%, 91.4%)',
        input: 'hsl(214.3, 31.8%, 91.4%)',
        card: 'hsl(0, 0%, 100%)',
        'card-foreground': 'hsl(222.2, 47.4%, 11.2%)',
        primary: 'hsl(222.2, 47.4%, 11.2%)',
        'primary-foreground': 'hsl(210, 40%, 98%)',
        secondary: 'hsl(210, 40%, 96.1%)',
        'secondary-foreground': 'hsl(222.2, 47.4%, 11.2%)',
        accent: 'hsl(210, 40%, 96.1%)',
        'accent-foreground': 'hsl(222.2, 47.4%, 11.2%)',
        destructive: 'hsl(0, 100%, 50%)',
        'destructive-foreground': 'hsl(210, 40%, 98%)',
        ring: 'hsl(215, 20.2%, 65.1%)',
        dark: {
          background: 'hsl(224, 71%, 4%)',
          foreground: 'hsl(213, 31%, 91%)',
          muted: 'hsl(223, 47%, 11%)',
          'muted-foreground': 'hsl(215.4, 16.3%, 56.9%)',
          accent: 'hsl(216, 34%, 17%)',
          'accent-foreground': 'hsl(210, 40%, 98%)',
          popover: 'hsl(224, 71%, 4%)',
          'popover-foreground': 'hsl(215, 20.2%, 65.1%)',
          border: 'hsl(216, 34%, 17%)',
          input: 'hsl(216, 34%, 17%)',
          card: 'hsl(224, 71%, 4%)',
          'card-foreground': 'hsl(213, 31%, 91%)',
          primary: 'hsl(210, 40%, 98%)',
          'primary-foreground': 'hsl(222.2, 47.4%, 1.2%)',
          secondary: 'hsl(222.2, 47.4%, 11.2%)',
          'secondary-foreground': 'hsl(210, 40%, 98%)',
          destructive: 'hsl(0, 63%, 31%)',
          'destructive-foreground': 'hsl(210, 40%, 98%)',
          ring: 'hsl(216, 34%, 17%)',
        }
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
      },
        fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        'neumorphism': '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'primary-light': '#3490dc',
        'primary-dark': '#2779bd',
      }),
      linearGradientDirections: {
        't': 'to top',
        'tr': 'to top right',
        'r': 'to right',
        'br': 'to bottom right',
        'b': 'to bottom',
        'bl': 'to bottom left',
        'l': 'to left',
        'tl': 'to top left',
      },
      radialGradientShapes: {
        'default': 'ellipse',
      },
      radialGradientSizes: {
        'default': 'closest-side',
      },
      radialGradientPositions: {
        'default': 'center',
      },
      radialGradientColors: theme => ({
        'primary-light': [theme('colors.primary.400'), theme('colors.primary.200')],
        'accent-light': [theme('colors.accent.400'), theme('colors.accent.200')],
      }),
    },
  },
  plugins: [
    require('tailwindcss-gradients'),
  ],
}