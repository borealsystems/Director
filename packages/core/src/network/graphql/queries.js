import { bridges } from '../../bridges'
import { logs } from '../../utils/log'
import { providers } from '../../providers'
import { deviceInstance } from '../../devices'
import { cores, devices, stacks, panels, controllers } from '../../db'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

// Types

import bridgeType from './bridgeTypes/bridgeType'
import coreType from './coreTypes/coreType'
import controllerType from './controllerTypes/controllerType'
import deviceType from './deviceTypes/deviceType.js'
import logType from './coreTypes/logType'
import panelType from './panelTypes/panelType'
import providerType from './providerTypes/providerType'
import providerFunctionType from './providerTypes/providerFunctionType'
import realmType from './coreTypes/realmType'
import stackType from './stackTypes/stackType.js'

const queries = new GraphQLObjectType({
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

    thisCore: {
      name: 'thisCore',
      description: 'Return this cores',
      type: new GraphQLObjectType({
        name: 'thisCoreType',
        fields: {
          id: {
            type: GraphQLString
          },
          label: {
            type: GraphQLString
          }
        }
      }),
      resolve: () => ({ id: process.env.DIRECTOR_CORE_ID, label: process.env.DIRECTOR_CORE_LABEL })
    },

    cores: {
      name: 'cores',
      description: 'Return cores',
      type: new GraphQLList(coreType),
      resolve: async () => {
        return await cores.find({}).toArray()
      }
    },

    realms: {
      name: 'realmsQuery',
      description: 'Return realms',
      type: new GraphQLList(realmType),
      resolve: () => new Promise((resolve, reject) => {
        const realmsArray = []
        cores.find({}).each((err, core) => {
          if (err) {
            reject(err)
          } else if (core == null) {
            resolve(realmsArray)
          } else {
            core.realms.map((realm, realmIndex) => {
              realmsArray.push({ ...realm, coreID: core.id, coreLabel: core.label })
            })
          }
        })
      })
    },

    realm: {
      name: 'realmQuery',
      description: 'Return realm',
      type: realmType,
      args: {
        realm: { type: GraphQLString },
        core: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        const core = await cores.findOne({ id: args.core, 'realms.id': args.realm })
        return core.realms.find(realm => realm.id === args.realm)
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

    devices: {
      name: 'Get Devices',
      description: 'Returns all configured by realm, core, or everything',
      type: new GraphQLList(deviceType),
      args: {
        realm: {
          type: GraphQLString
        },
        core: {
          type: GraphQLString
        }
      },
      resolve: async (p, args) => {
        const realmFilter = args.realm ? { realm: args.realm } : {}
        const coreFilter = args.core ? { core: args.core } : {}
        const devicesArray = await devices.find({ ...realmFilter, ...coreFilter }).toArray()
        const coresArray = args.realm === 'ROOT' ? [] : await devices.find({ 'provider.id': 'BorealSystems-DirectorInternal' }).toArray()
        return [...devicesArray, ...coresArray]
      }
    },

    device: {
      name: 'Get Device by ID',
      description: 'Returns a device specified by the ID',
      type: deviceType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        return await devices.findOne({ id: args.id })
      }
    },

    deviceFunctions: {
      name: 'deviceFunctions',
      description: 'Returns all providers functions for all configured devices in a realm',
      type: new GraphQLList(providerFunctionType),
      args: {
        id: {
          type: GraphQLString
        },
        realm: {
          type: GraphQLString
        },
        core: {
          type: GraphQLString
        }
      },
      resolve: (p, args) => typeof deviceInstance[args.id].providerFunctions === 'function' ? deviceInstance[args.id].providerFunctions(args) : deviceInstance[args.id].providerFunctions
    },

    stacks: {
      name: 'Get Stacks',
      description: 'Returns all configured stacks',
      type: new GraphQLList(stackType),
      args: {
        realm: {
          type: GraphQLString
        },
        core: {
          type: GraphQLString
        }
      },
      resolve: async (p, args) => {
        const realmFilter = args.realm ? { realm: args.realm } : {}
        const coreFilter = args.core ? { core: args.core } : {}
        return await stacks.find({ ...realmFilter, ...coreFilter }).toArray()
      }
    },

    panels: {
      name: 'Get Panels',
      description: 'Returns all configured panels',
      type: new GraphQLList(panelType),
      args: {
        realm: {
          type: GraphQLString
        },
        core: {
          type: GraphQLString
        }
      },
      resolve: async (p, args) => {
        const realmFilter = args.realm ? { realm: args.realm } : {}
        const coreFilter = args.core ? { core: args.core } : {}
        return await panels.find({ ...realmFilter, ...coreFilter }).toArray()
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
      args: {
        realm: {
          type: GraphQLString
        },
        core: {
          type: GraphQLString
        }
      },
      resolve: async (p, args) => {
        const realmFilter = args.realm ? { realm: args.realm } : {}
        const coreFilter = args.core ? { core: args.core } : {}
        return await controllers.find({ ...realmFilter, ...coreFilter }).toArray()
      }
    }
  }
})

export { queries }
