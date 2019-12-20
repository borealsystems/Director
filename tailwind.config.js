module.exports = {
  theme: {
    extend: {
      colors: {
        background: {
          default: '#16161a',
          light: '#242629'
        },
        heading: '#fffffe',
        text: '#94a1b2',
        highlight: '#2cb67d'
      }
    }
  },
  variants: {
    backgroundColor: ['dark', 'dark-hover', 'dark-group-hover', 'hover'],
    borderColor: ['dark', 'dark-focus', 'dark-focus-within'],
    textColor: ['dark', 'dark-hover', 'dark-active', 'hover'],
    margin: ['responsive', 'hover', 'focus'],
    width: ['responsive', 'hover', 'focus']
  },
  plugins: [
    require('tailwindcss-dark-mode')()
  ]
}
