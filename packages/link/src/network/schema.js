import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import { initGQLClient } from './graphql'
import { config } from '../utils/config'

const connectionType = new GraphQLObjectType({
  name: 'connectionType',
  fields: {
    host: {
      type: GraphQLString
    },
    status: {
      type: GraphQLBoolean
    },
    https: {
      type: GraphQLBoolean
    }
  }
})

const connectionInputType = new GraphQLInputObjectType({
  name: 'connectionInputType',
  fields: {
    host: {
      type: GraphQLString
    },
    status: {
      type: GraphQLBoolean
    },
    https: {
      type: GraphQLBoolean
    }
  }
})

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: {
      connection: {
        name: 'connection',
        description: 'Return connection information',
        type: connectionType,
        resolve: () => {
          return config.get('connection')
        }
      }
    }
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      connection: {
        name: 'connection',
        description: 'Update and reconnect',
        type: connectionType,
        args: {
          connection: {
            type: connectionInputType
          }
        },
        resolve: (parent, args) => {
          config.set('connection', { ...args.connection })
          initGQLClient(args.connection.host, args.connection.https)
          return 'OK'
        }
      }
    }
  })
})

export { schema }
