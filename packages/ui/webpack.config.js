const path = require('path')
const webpack = require('webpack')

const port = process.env.PORT || 3000

module.exports = {
  mode: 'development',

  entry: [
    // 'webpack-dev-server/client?http://0.0.0.0:3000',
    './src/index.js'
  ],

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: 'sourcemaps/[file].map'
    })
  ],

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },

  optimization: {
    usedExports: true
  },

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
    host: '0.0.0.0',
    port: port,
    historyApiFallback: true,
    open: false,
    disableHostCheck: true,
    contentBase: path.join(__dirname, '/src/public/'),
    publicPath: 'http://localhost:3000/dist/',
    proxy: {
      '/graphql': {
        target: 'ws://localhost:3001',
        changeOrigin: true,
        ws: true
      }
    },
    hot: true,
    hotOnly: true
  }
}
