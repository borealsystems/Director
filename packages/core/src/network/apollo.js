import log from '../utils/log'
import { schema } from './graphql/schema'

const { ApolloServer } = require('apollo-server')

let port

const initApollo = () => {
  port = process.env.NODE_ENV === 'development' ? 3001 : 3000

  const apollo = new ApolloServer({
    schema: schema,
    context: ({ req }) => ({ req: req })
  })

  apollo.listen({ port: port }).then(({ url, subscriptionsUrl }) => {
    log('info', 'core/network/apollo', `Apollo 🚀 Server ready at ${url}`)
    log('info', 'core/network/apollo', `🚀  Subscriptions ready at ${subscriptionsUrl}`)
  })
}

export { initApollo, port }
