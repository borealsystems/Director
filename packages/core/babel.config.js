module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14.4.0'
        }
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-proposal-class-properties'
    ]
  ]
}
