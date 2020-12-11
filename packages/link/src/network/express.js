
import { schema } from './schema'
import express from 'express'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import path from 'path'
import cors from 'cors'
import log from '../utils/log'
const { graphqlHTTP } = require('express-graphql')
const webpackConfiguration = require('../../webpack.config.js')

const initExpress = () => {
  const app = express()
  const dev = process.env.NODE_ENV === 'development'

  app.use(cors())

  // dev && app.use(middleware(
  //   webpack(webpackConfiguration),
  //   { publicPath: '/dist' }
  // ))

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: dev
  }))

  app.get('/dist/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, './ui/dist/bundle.js'))
  })

  app.get('/dist/connected_world.svg', (req, res) => {
    res.sendFile(path.join(__dirname, './ui/dist/connected_world.svg'))
  })

  app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, './ui/public/favicon.ico'))
  })

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './ui/public/index.html'))
  })

  const port = 3010

  app.listen(port, () => {
    log('info', 'network/express', `🚀 Configuration UI ready at http://localhost:${port}`)
  })
}

export { initExpress }
