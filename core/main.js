import dbload from './libs/dbUtils'
import './network'
import system from './libs/system'
import webpackConfigurationObject from '../webpack.config.js'

const debug = require('debug')('BorealDirector:core/main')

if (process.env.NODE_ENV === 'development') {
  const Webpack = require('webpack')
  const WebpackDevServer = require('webpack-dev-server')

  const compiler = Webpack(webpackConfigurationObject)
  const devServerOptions = Object.assign({}, webpackConfigurationObject.devServer, {
    stats: {
      colors: true
    }
  })
  const server = new WebpackDevServer(compiler, devServerOptions)

  server.listen(3000, '127.0.0.1', () => {
    debug('Starting server on http://localhost:3000')
  })
}
// const debug = require('debug')('src/core')
dbload()
system.on('db', (stream) => {
  console.log(stream)
})
