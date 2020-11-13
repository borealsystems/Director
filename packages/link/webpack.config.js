const path = require('path')

const port = process.env.PORT || 3010

module.exports = {
  mode: 'development',

  entry: [
    './src/network/ui/src/index.jsx'
  ],

  output: {
    path: path.resolve(__dirname, './src/network/ui/dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: ['react-hot-loader/webpack', 'babel-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  devServer: {
    host: '0.0.0.0',
    port: port,
    historyApiFallback: true,
    open: false,
    disableHostCheck: true,
    contentBase: path.join(__dirname, './src/network/ui/public/'),
    publicPath: `http://localhost:${port}/dist/`,
    hot: false
  }
}
