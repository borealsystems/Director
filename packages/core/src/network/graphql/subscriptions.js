import { PubSub } from 'apollo-server'

import { GraphQLObjectType } from 'graphql'

// Types
import controllerType from './controllerTypes/controllerType'
import logType from './coreTypes/logType'

const pubsub = new PubSub()

const LOG_ADDED = 'LOG_ADDED'
const BRIDGE_UPDATES = 'BRIDGE_UPDATES'
const CONTROLLER_UPDATE = 'CONTROLLER_UPDATE'

const subscriptions = new GraphQLObjectType({
  name: 'Subscriptions',
  fields: {
    subscribeToLogs: {
      name: 'Subscribe to Logs',
      description: 'Returns the logs',
      type: logType,
      subscribe: () => pubsub.asyncIterator([LOG_ADDED])
    },

    bridgeUpdates: {
      name: 'Bridge Updates',
      description: 'Obselete',
      type: logType,
      subscribe: () => pubsub.asyncIterator([BRIDGE_UPDATES])
    },

    controller: {
      name: 'Controller Updates',
      description: 'Subscription for all controller updates',
      type: controllerType,
      subscribe: () => pubsub.asyncIterator([CONTROLLER_UPDATE])
    }
  }
})

export { subscriptions, pubsub }
