import { providers } from '../providers'
import { createNewDevice, devices } from '../../devices'
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

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      // Status and Logs
      getStatus: { // Status Slug
        type: new GraphQLList(
          GraphQLString
        ),
        resolve: () => {
          return db.get('status')
        }
      },

      getLogs: { // Status Message
        type: new GraphQLList(logType),
        resolve: () => { return logs }
      },

      // Communication Providers
      getProviders: {
        type: new GraphQLList(providerType),
        resolve: () => { return providers }
      },

      getDevices: {
        type: new GraphQLList(deviceType),
        resolve: () => { return devices }
      }
    }
  }),

  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      newDevice: { // Set controller brightness by UUID
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
      }
    }
  })
})

export { schema }
