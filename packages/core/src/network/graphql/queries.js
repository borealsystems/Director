import { bridges } from '../../bridges'
import { logs } from '../../utils/log'
import { providers } from '../../providers'
import { deviceInstance } from '../../devices'
import { cores, devices, stacks, panels, controllers } from '../../db'
import { controllerLayouts } from '../../controllers'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql'

// Types

import bridgeType from './bridgeTypes/bridgeType'
import coreType from './coreTypes/coreType'
import controllerType from './controllerTypes/controllerType'
import controllerLayoutType from './controllerTypes/controllerLayoutType'
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
      resolve: (p, args) => {
        if (deviceInstance[args.id]) {
          if (typeof deviceInstance[args.id].providerFunctions === 'function') return deviceInstance[args.id].providerFunctions(args)
          else return deviceInstance[args.id].providerFunctions
        } else return []
      }
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
      resolve: (p, args) => new Promise((resolve, reject) => {
        const realmFilter = args.realm ? { realm: args.realm } : {}
        const coreFilter = args.core ? { core: args.core } : {}
        const resolveArray = []
        stacks.find({ ...realmFilter, ...coreFilter }).each((err, stack) => {
          if (err) {
            reject(err)
          } else if (stack == null) {
            resolve(resolveArray)
          } else {
            resolveArray.push({
              ...stack,
              ...stack.actions.map(action => {
                action.device = devices.findOne({ id: action.device.id })
              })
            })
          }
        })
      })
    },

    stack: {
      name: 'Get Stack',
      description: 'Returns stack by ID',
      type: stackType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          stacks.findOne({ id: args.id })
            .then(stack => resolve({
              ...stack,
              ...stack.actions.map(action => {
                action.device = devices.findOne({ id: action.device.id })
              })
            }))
            .catch(e => reject(e))
        })
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

    controllerLayouts: {
      name: 'Get Controller Layouts',
      description: 'Returns an array of controller layouts',
      type: new GraphQLList(controllerLayoutType),
      resolve: () => { return controllerLayouts }
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
    },

    controller: {
      name: 'Get a Controller',
      description: 'Returns a specific controller',
      type: controllerType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          controllers.findOne({ id: args.id })
            .then(panel => resolve(panel))
            .catch(e => reject(e))
        })
      }
    },

    dependents: {
      name: 'dependentObjects',
      description: 'Returns dependent objects',
      type: new GraphQLObjectType({
        name: 'dependentObjectsType',
        fields: {
          count: {
            type: GraphQLInt
          },
          list: {
            type: new GraphQLList(
              new GraphQLObjectType({
                name: 'dependentObjectsObjectType',
                fields: {
                  id: {
                    type: GraphQLString
                  },
                  label: {
                    type: GraphQLString
                  }
                }
              })
            )
          }
        }
      }),
      args: {
        type: {
          type: GraphQLString
        },
        id: {
          type: GraphQLString
        }
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          const resolveArray = []
          switch (args.type) {
            case 'device':
              stacks.find({ actions: { $elemMatch: { 'device.id': args.id } } }).each((err, stack) => {
                if (err) {
                  reject(err)
                } else if (stack == null) {
                  resolve({ count: resolveArray.length, list: resolveArray })
                } else {
                  resolveArray.push({ id: stack.id, label: stack.label })
                }
              })
              break
            case 'stack':
              panels.find({ buttons: { $elemMatch: { $elemMatch: { 'stack.id': args.id } } } }).each((err, panel) => {
                if (err) {
                  reject(err)
                } else if (panel == null) {
                  resolve({ count: resolveArray.length, list: resolveArray })
                } else {
                  resolveArray.push({ id: panel.id, label: panel.label })
                }
              })
              break
            case 'panel':
              controllers.find({ 'panel.id': args.id }).each((err, controller) => {
                if (err) {
                  reject(err)
                } else if (controller == null) {
                  resolve({ count: resolveArray.length, list: resolveArray })
                } else {
                  resolveArray.push({ id: controller.id, label: controller.label })
                }
              })
              break
          }
        })
      }
    }
  }
})

export { queries }
