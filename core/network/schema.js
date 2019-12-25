import { definitions, ProviderRequirements } from '../libs/globals'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { find } from 'lodash'
import db from '../libs/db'
import system from '../libs/system'
const uuidBase62 = require('uuid-base62')
const debug = require('debug')('BorealDirector:core/network/schema')

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      definition: { // Full Device Definition
        type: GraphQLJSONObject,
        args: {
          definitionName: { type: GraphQLString }
        },
        resolve: (obj, args, context, info) => { return find(definitions, { name: args.definitionName }) }
      },
      providerRequirements: { // Provider Requirements
        type: GraphQLJSONObject,
        args: {
          provider: { type: GraphQLString }
        },
        resolve: (obj, args, context, info) => { return find(ProviderRequirements, args.provider) }
      },
      definitionNames: { // Device Definition Listing
        type: new GraphQLList(GraphQLString),
        resolve: () => definitions.map((key, index) => { return definitions[index].name })
      },
      status: { // Status Slug
        type: GraphQLString,
        resolve: () => { return 'good' }
      },
      statusMessage: { // Status Message
        type: GraphQLString,
        resolve: () => { return 'System Operating As Intended' }
      },
      devices: { // List all devices
        type: GraphQLJSONObject,
        resolve: () => { return db.get('devices') }
      }
    }
  }),

  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      newDevice: {
        type: GraphQLString,
        args: {
          name: { type: GraphQLString },
          definition: { type: GraphQLString },
          ok: { type: GraphQLBoolean },
          config: { type: GraphQLJSONObject }
        },
        resolve: (parent, args) => {
          const uuid = uuidBase62.v4()
          const newDevice = {
            name: args.name,
            definition: args.definition,
            config: args.config
          }
          db.put(`devices.${uuid}`, newDevice)
          system.emit('device_update', uuid)
          debug(newDevice)
          return `devices.${uuid}`
        }
      },
      deleteDevice: {
        type: GraphQLString,
        args: {
          uuid: { type: GraphQLString }
        },
        resolve: (parent, args) => {
          db.remove(`devices.${args.uuid}`)
          system.emit('device_delete', args.uuid)
          return `${args.uuid} deleted`
        }
      }
    }
  })
})

export { schema }
