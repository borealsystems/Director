import log from '../utils/log'
import express from 'express'
import path from 'path'
import { schema } from './graphql/schema'
import cors from 'cors'

const { ApolloServer } = require('apollo-server')

// let server
let port

const initExpress = () => {
  const app = express()
  app.use(cors())

  // const graphqlServer = graphqlHTTP((req, res) => ({
  //   schema: schema,
  //   graphiql: dev,
  //   context: {
  //     req,
  //     res
  //   }
  // }))

  // app.get('/gql', graphqlServer)
  // app.post('/gql', graphqlServer)

  app.get('/dist/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../ui/dist/bundle.js'))
  })

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../../../ui/src/public/index.html'))
  })

  port = process.env.NODE_ENV === 'development' ? 3001 : 3000

  // server = app.listen(port, () => {
  //   log('info', 'core/lib/network/express', `Director UI Available on http://localhost:${port}`)
  // })

  const apollo = new ApolloServer({
    subscriptions: {
      onConnect: (connectionParams, webSocket, context) => {
        var clientIP = context.socket._socket.remoteAddress
        if (clientIP.substr(0, 7) === '::ffff:') {
          clientIP = clientIP.substr(7)
        }
        log('info', 'core/lib/network/express', `GraphQL Client ${clientIP} connected`)
      },
      onDisconnect: (webSocket, context) => {
        var clientIP = context.socket._socket.remoteAddress
        if (clientIP.substr(0, 7) === '::ffff:') {
          clientIP = clientIP.substr(7)
        }
        log('info', 'core/lib/network/express', `GraphQL Client ${clientIP} disconnected`)
      }
    },
    schema: schema,
    context: ({ req }) => ({ req: req })
  })

  apollo.listen({ port: port }).then(({ url }) => {
    log('info', 'core/lib/network/express', `Apollo 🚀 Server ready at ${url}`)
  })
}

const cleanupExpress = () => {
  // if (server !== null) {
  //   server.close()
  // }
}

export { initExpress, cleanupExpress, port }
