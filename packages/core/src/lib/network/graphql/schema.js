import { providers } from '../../providers'
import { updateDevice, deleteDevice, devices } from '../../devices'
import { updateStack, deleteStack, executeStack, stacks } from '../../stacks'
import { logs } from '../../utils/log'
import db from '../../db'

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

import providerType from './providerType'
import logType from './logType'
import deviceType from './deviceTypes/deviceType.js'
import deviceUpdateInputType from './deviceTypes/deviceUpdateInputType.js'
import stackType from './stackTypes/stackType.js'
import stackUpdateInputType from './stackTypes/stackUpdateInputType'

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: {
      getStatus: {
        name: 'Get Status Slug',
        description: 'Returns a status slug to be displayed on the UI homepage',
        type: new GraphQLList(
          GraphQLString
        ),
        resolve: () => {
          return db.get('status')
        }
      },

      getLogs: {
        name: 'Get Logs',
        description: 'Returns an array of logs from the core',
        type: new GraphQLList(logType),
        resolve: () => { return logs }
      },

      getProviders: {
        name: 'Get Communication Providers',
        description: 'Returns all available communication providers, the backend of a device and what defines available actions',
        type: new GraphQLList(providerType),
        resolve: () => {
          return providers
        }
      },

      // TODO: rename
      getDevices: {
        name: 'Get Devices',
        description: 'Returns all configured devices',
        type: new GraphQLList(deviceType),
        resolve: () => { return devices }
      },

      deviceByID: {
        name: 'Get Device by ID',
        description: 'Returns a device specified by the ID',
        type: deviceType,
        args: {
          id: { type: GraphQLString }
        },
        resolve: (parent, args) => {
          return devices.find(device => device.id === args.id)
        }
      },

      getStacks: {
        name: 'Get Stacks',
        description: 'Returns all configured stacks',
        type: new GraphQLList(stackType),
        resolve: () => { return stacks }
      }
    }
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      updateDevice: {
        name: 'Create or Modify a Device',
        description: 'If ID is given, modifies existing device, if not it creates new and returns ID',
        type: deviceType,
        args: {
          device: {
            type: deviceUpdateInputType
          }
        },
        resolve: (parent, args) => {
          return updateDevice(args.device)
        }
      },

      deleteDevice: {
        type: GraphQLString,
        args: {
          id: { type: GraphQLString }
        },
        resolve: (parent, args) => {
          return deleteDevice(args.id)
        }
      },

      updateStack: {
        name: 'Stack Update',
        description: 'Creates a new stack or modifies and existing one',
        type: stackType,
        args: {
          stack: {
            type: stackUpdateInputType
          }
        },
        resolve: (parent, args) => {
          return updateStack(args.stack)
        }
      },

      deleteStack: {
        name: 'Delete Stack',
        description: 'Removes a stack from existance',
        type: GraphQLString,
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: (parent, args) => {
          return deleteStack(args.id)
        }
      },

      executeStack: {
        name: 'Trigger Stack',
        description: 'activates and runs a stack',
        type: GraphQLString,
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: (parent, args) => {
          return executeStack(args.id)
        }
      }
    }
  })
})

export { schema }
