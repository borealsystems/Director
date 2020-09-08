import { bridges, registerBridge } from '../../bridges'
import { updateController } from '../../controllers'
import { updateDevice, deleteDevice } from '../../devices'
import { logs } from '../../utils/log'
import { updatePanel, deletePanel } from '../../panels'
import { providers } from '../../providers'
import { updateStack, deleteStack, executeStack } from '../../stacks'
import { PubSub } from 'apollo-server'
import { core, devices, stacks, panels, controllers } from '../../db'

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

// Types

import bridgeType from './bridgeTypes/bridgeType'
import bridgeUpdateInputType from './bridgeTypes/bridgeUpdateInputType'
import coreConfigType from './coreTypes/coreConfigType'
import coreConfigInputType from './coreTypes/coreConfigInputType'
import controllerType from './controllerTypes/controllerType'
import controllerInputType from './controllerTypes/controllerInputType'
import deviceType from './deviceTypes/deviceType.js'
import deviceUpdateInputType from './deviceTypes/deviceUpdateInputType.js'
import logType from './coreTypes/logType'
import panelType from './panelTypes/panelType'
import panelUpdateInputType from './panelTypes/panelUpdateInputType'
import providerType from './providerType'
import stackType from './stackTypes/stackType.js'
import stackUpdateInputType from './stackTypes/stackUpdateInputType'

const pubsub = new PubSub()

const LOG_ADDED = 'LOG_ADDED'
const BRIDGE_UPDATES = 'BRIDGE_UPDATES'
const CONTROLLER_UPDATE = 'CONTROLLER_UPDATE'

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: {
      status: {
        name: 'Get Status Slug',
        description: 'Returns a status slug to be displayed on the UI homepage',
        type: new GraphQLList(
          GraphQLString
        ),
        resolve: () => {
          return ['success', 'All Systems Go', 'Director is operating as intended and is not reporting any errors.']
        }
      },

      coreConfig: {
        name: 'Get Core Config',
        description: 'Return Core Configuration Options',
        type: coreConfigType,
        resolve: () => {
          return new Promise((resolve, reject) => {
            resolve({
              label: process.env.DIRECTOR_CORE_CONFIG_LABEL,
              systemNotes: 'Welcome to Director!\n\nAdministrators can edit this note via the Core Configuration page.\n\nYou should probably include some useful notes here, like who manages and administers this system, and a link to your internal helpdesk or ticketing system for users having problems.',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })
          })
        }
      },

      logs: {
        name: 'Get Logs',
        description: 'Returns an array of logs from the core',
        type: new GraphQLList(logType),
        resolve: () => { return logs }
      },

      providers: {
        name: 'Get Communication Providers',
        description: 'Returns all available communication providers, the backend of a device and what defines available actions',
        type: new GraphQLList(providerType),
        resolve: () => {
          return providers
        }
      },

      // TODO: rename
      devices: {
        name: 'Get Devices',
        description: 'Returns all configured devices',
        type: new GraphQLList(deviceType),
        resolve: async () => {
          return await devices.find({}).toArray()
        }
      },

      device: {
        name: 'Get Device by ID',
        description: 'Returns a device specified by the ID',
        type: deviceType,
        args: {
          id: { type: GraphQLString }
        },
        resolve: (parent, args) => {
          return devices.get(args.id)
        }
      },

      stacks: {
        name: 'Get Stacks',
        description: 'Returns all configured stacks',
        type: new GraphQLList(stackType),
        resolve: async () => {
          return await stacks.find({}).toArray()
        }
      },

      panels: {
        name: 'Get Panels',
        description: 'Returns all configured panels',
        type: new GraphQLList(panelType),
        resolve: async () => {
          return await panels.find({}).toArray()
        }
      },

      panel: {
        name: 'Get Panel',
        description: 'Returns panel by id',
        type: panelType,
        args: {
          id: { type: GraphQLString }
        },
        resolve: (parent, args) => {
          return new Promise((resolve, reject) => {
            panels.findOne({ id: args.id })
              .then(panel => resolve(panel))
              .catch(e => reject(e))
          })
        }
      },

      getBridges: {
        name: 'Get Bridges',
        description: 'Returns all connected bridges',
        type: new GraphQLList(bridgeType),
        resolve: () => { return bridges }
      },

      controllers: {
        name: 'Get Controllers',
        description: 'Returns all controllers, both online and offline',
        type: new GraphQLList(controllerType),
        resolve: async () => {
          return await controllers.find({}).toArray()
        }
      }
    }
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      device: {
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
      },

      updatePanel: {
        name: 'Panel Update',
        description: 'Update or create a panel',
        type: panelType,
        args: {
          panel: {
            type: panelUpdateInputType
          }
        },
        resolve: (parent, args) => {
          return updatePanel(args.panel)
        }
      },

      deletePanel: {
        name: 'Delete Panel',
        description: 'Obliterates the selected panel',
        type: GraphQLString,
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: (parent, args) => {
          return deletePanel(args.id)
        }
      },

      updateBridge: {
        name: 'Update Bridge',
        description: 'Registers or Updates a Bridge',
        type: GraphQLString,
        args: {
          bridge: {
            type: bridgeUpdateInputType
          }
        },
        resolve: (parent, args, context, info) => {
          var clientIP = context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress
          if (clientIP.substr(0, 7) === '::ffff:') {
            clientIP = clientIP.substr(7)
          }
          return registerBridge({ ...args.bridge, address: clientIP })
        }
      },

      controller: {
        name: 'Controller Update',
        description: 'Update a controller',
        type: controllerType,
        args: {
          controller: {
            type: controllerInputType
          }
        },
        resolve: (parent, args) => {
          return updateController(args.controller)
        }
      },

      coreConfig: {
        name: 'Core Config Update',
        description: 'Update the core config and reload web server',
        type: coreConfigType,
        args: {
          config: {
            type: coreConfigInputType
          }
        },
        resolve: (parent, args) => {
          return new Promise((resolve, reject) => {
            core.put('config', args.config)
              .then(() => resolve(args.config))
              .catch(e => reject(e))
          })
        }
      }
    }
  }),

  subscription: new GraphQLObjectType({
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
})

export { schema, pubsub }
