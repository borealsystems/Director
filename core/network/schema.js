import { definitions, ProviderRequirements, functions } from '../libs/globals'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { find } from 'lodash'
import db from '../libs/db'
// eslint-disable-next-line no-unused-vars
import { deviceCreate, deviceModify, deviceDelete } from '../libs/deviceManager'
import controllerManager from '../libs/controllers/controllerManager'
import actionManager from '../libs/actionManager'

// TODO: NonNullable things

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

      // Status and Logs

      status: { // Status Slug
        type: GraphQLString,
        resolve: () => { return 'good' }
      },

      statusMessage: { // Status Message
        type: GraphQLString,
        resolve: () => { return 'System Operating As Intended' }
      },

      // TODO: Implement central logging

      // Providers

      providerRequirements: { //  List provider Requirements
        type: GraphQLJSONObject,
        args: {
          provider: { type: GraphQLString }
        },
        resolve: (obj, args, context, info) => { return find(ProviderRequirements, args.provider) }
      },

      // Definitions

      definition: { // Get full device definition
        type: GraphQLJSONObject,
        args: {
          definitionName: { type: GraphQLString }
        },
        resolve: (obj, args, context, info) => { return find(definitions, { name: args.definitionName }) }
      },

      definitionNames: { // List all device definitions
        type: new GraphQLList(GraphQLString),
        resolve: () => definitions.map((key, index) => { return definitions[index].name })
      },

      // Devices

      getDevices: { // List all configured devices
        type: new GraphQLList(GraphQLJSONObject),
        resolve: () => { return db.get('devices') }
      },

      // Functions

      getFunctions: { // All available functions as reported by definitions
        type: new GraphQLList(GraphQLJSONObject),
        resolve: () => { return functions }
      },

      // Actions

      actions: { // List all configured actions
        type: new GraphQLList(GraphQLJSONObject),
        resolve: () => { return db.get('actions') }
      },

      // Controllers

      controllers: { // List all connected controllers
        type: new GraphQLList(GraphQLJSONObject),
        resolve: () => { return db.get('controllers') }
      }
    }
  }),

  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {

      // Devices

      newDevice: { // Create a new device
        type: GraphQLString,
        args: {
          definition: { type: GraphQLString },
          name: { type: GraphQLString },
          ok: { type: GraphQLBoolean },
          config: { type: GraphQLJSONObject }
        },
        resolve: (parent, args) => {
          const newDevice = {
            name: args.name,
            definition: args.definition,
            config: args.config
          }
          return deviceCreate(newDevice)
        }
      },

      // TODO: Edit devices

      deleteDevice: { // Delete a device by UUID
        type: GraphQLString,
        args: {
          uuid: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (parent, args) => {
          deviceDelete(args.uuid)
          return 200
        }
      },

      // Actions

      createAction: { // Create a new action
        type: GraphQLString,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          device: { type: new GraphQLNonNull(GraphQLString) },
          function: { type: new GraphQLNonNull(GraphQLString) },
          params: { type: GraphQLJSONObject }
        },
        resolve: (parent, args) => {
          actionManager.createAction(args.name, args.device, args.function, args.params)
        }
      },

      // Controllers

      setControllerBrightness: { // Set controller brightness by UUID
        type: GraphQLString,
        args: {
          uuid: { type: GraphQLString },
          brightness: { type: GraphQLInt }
        },
        resolve: (parent, args) => {
          controllerManager.setBrightness(args.uuid, args.brightness)
          return args.brightness
        }
      }
    }
  })
})

export { schema }
