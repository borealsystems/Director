const path = require('path')
const webpack = require('webpack')

const port = process.env.PORT || 3000

module.exports = {
  mode: 'development',

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    './src/index.js'
  ],

  output: {
    path: path.resolve(__dirname, 'dist/ui/'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: ['react-hot-loader/webpack', 'babel-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000
            }
          }
        ]
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
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    open: false,
    contentBase: path.join(__dirname, '/src/public/'),
    publicPath: 'http://localhost:3000/dist/',
    proxy: {
      '/gql': 'http://localhost:3001/'
    },
    hot: true,
    hotOnly: true
  }
}
