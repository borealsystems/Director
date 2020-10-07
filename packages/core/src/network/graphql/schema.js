import { GraphQLSchema } from 'graphql'

import { queries } from './queries'
import { mutations } from './mutations'
import { subscriptions, pubsub } from './subscriptions'

var schema = new GraphQLSchema({
  query: queries,
  mutation: mutations,
  subscription: subscriptions
})

export { schema, pubsub }
