import log from '../utils/log'
import { schema } from './graphql/schema'

const { ApolloServer } = require('apollo-server')

let port

const initApollo = () => {
  port = process.env.NODE_ENV === 'development' ? 3001 : 3000

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
    log('info', 'core/lib/network/apollo', `Apollo 🚀 Server ready at ${url}`)
  })
}

export { initApollo, port }
