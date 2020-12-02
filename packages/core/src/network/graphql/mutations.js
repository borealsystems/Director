import { registerBridge } from '../../bridges'
import { updateController, deleteController } from '../../controllers'
import { updateDevice, deleteDevice, disableDevice, enableDevice } from '../../devices'
import { updatePanel, deletePanel } from '../../panels'
import { updateStack, duplicateStack, deleteStack, executeStack } from '../../stacks'
import { cores } from '../../db'

import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

// Types
import bridgeUpdateInputType from './bridgeTypes/bridgeUpdateInputType'
import coreType from './coreTypes/coreType'
import coreInputType from './coreTypes/coreInputType'
import controllerType from './controllerTypes/controllerType'
import controllerInputType from './controllerTypes/controllerInputType'
import deviceType from './deviceTypes/deviceType.js'
import deviceUpdateInputType from './deviceTypes/deviceUpdateInputType.js'
import panelType from './panelTypes/panelType'
import panelUpdateInputType from './panelTypes/panelUpdateInputType'
import realmInputType from './coreTypes/realmInputType'
import stackType from './stackTypes/stackType.js'
import stackUpdateInputType from './stackTypes/stackUpdateInputType'
import STATUS from '../../utils/statusEnum'
import log from '../../utils/log'

const mutations = new GraphQLObjectType({
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

    disableDevice: {
      name: 'disableDeviceMutationType',
      type: GraphQLString,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (parent, args) => {
        return disableDevice(args.id)
      }
    },

    enableDevice: {
      name: 'enableDeviceMutationType',
      type: GraphQLString,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (parent, args) => {
        return enableDevice(args.id)
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

    duplicateStack: {
      name: 'duplicateStackMutation',
      description: 'Duplicate an existing stack',
      type: GraphQLString,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (parent, args) => duplicateStack(args.id)
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

    deleteController: {
      name: 'Delete Controller',
      description: 'Removes a Controller from existance',
      type: GraphQLString,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (parent, args) => {
        return deleteController(args.id)
      }
    },

    core: {
      name: 'coreMutation',
      description: 'Update a core\'s configuration',
      type: coreType,
      args: {
        core: {
          type: coreInputType
        }
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          cores.updateOne({ id: args.core.id }, { $set: args.core })
            .then(() => {
              return cores.findOne({ id: args.core.id })
            })
            .then(core => {
              resolve(core)
            })
        })
      }
    },

    createRealm: {
      name: 'createRealmMutation',
      description: 'Creates a realm',
      type: GraphQLString,
      args: {
        realm: {
          type: realmInputType
        }
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          cores.updateOne(
            { id: args.realm.coreID },
            { $addToSet: { realms: { id: args.realm.id, label: args.realm.label, description: args.realm.description, notes: args.realm.notes } } }
          )
            .then(() => {
              log('info', 'core/network/graphql', `Created Realm ${args.realm.id} (${args.realm.label})`)
              resolve(STATUS.OK)
            })
        })
      }
    },

    updateRealm: {
      name: 'updateRealmMutation',
      description: 'Updates a realm',
      type: GraphQLString,
      args: {
        realm: {
          type: realmInputType
        }
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          cores.updateOne(
            { id: args.realm.coreID, 'realms.id': args.realm.id },
            { $set: { 'realms.$': { ...args.realm } } }
          )
            .then(() => {
              log('info', 'core/network/graphql', `Updated Realm ${args.realm.id} (${args.realm.label})`)
              resolve(STATUS.OK)
            })
        })
      }
    },

    deleteRealm: {
      name: 'deleteRealmMutation',
      description: 'Deletes a realm',
      type: GraphQLString,
      args: {
        realm: {
          type: realmInputType
        }
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          cores.updateOne(
            { id: args.realm.coreID },
            { $pull: { realms: { id: args.realm.id } } }
          )
            .then(() => {
              log('info', 'core/network/graphql', `Deleted Realm ${args.realm.id}`)
              resolve(STATUS.OK)
            })
        })
      }
    }
  }
})

export { mutations }
