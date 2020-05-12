import { providers } from '../../providers'
import { createNewDevice, deleteDevice, devices } from '../../devices'
import { createNewStack, executeStack, stacks } from '../../stacks'
import { logs } from '../../log'
import db from '../../db'
import shortid from 'shortid'

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

import providerType from './providerType'
import logType from './logType'
import deviceType from './deviceTypes/deviceType.js'
import newDeviceInputType from './deviceTypes/newDeviceInputType.js'
import stackType from './stackTypes/stackType.js'
import newStackInputType from './stackTypes/newStackInputType'

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
        resolve: () => { return providers }
      },

      getDevices: {
        name: 'Get Devices',
        description: 'Returns all configured devices',
        type: new GraphQLList(deviceType),
        resolve: () => { return devices }
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
      newDevice: {
        name: 'New Device',
        description: 'Creates a new device with one of the available communications providers',
        type: deviceType,
        args: {
          device: {
            type: newDeviceInputType
          }
        },
        resolve: (parent, args) => {
          const newDevice = {
            id: shortid.generate(),
            ...args.device,
            provider: args.device.provider.id
          }
          return createNewDevice(newDevice)
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

      newStack: {
        name: 'New Stack',
        description: 'Creates a new stack',
        type: stackType,
        args: {
          stack: {
            type: newStackInputType
          }
        },
        resolve: (parent, args) => {
          const newStack = {
            id: shortid.generate(),
            ...args.stack
          }
          return createNewStack(newStack)
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
