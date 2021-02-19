import { bridgeResolvers } from '../../bridges/bridgeResolvers'
import { controllerResolvers } from '../../controllers/controllerResolvers'
import { deviceResolvers } from '../../devices/deviceResolvers'
import { stackResolvers } from '../../stacks/stackResolvers'
import { panelResolvers } from '../../panels/panelResolvers'
import { coreResolvers } from '../../coreResolvers'
import { tagResolvers } from '../../tags/tagResolvers'

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
import stackUpdateInputType, { actionInputType } from './stackTypes/stackUpdateInputType'
import tagType from './tagTypes/tagType'
import tagInputType from './tagTypes/tagInputType'

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
      resolve: deviceResolvers.deviceMutationResolver
    },

    deleteDevice: {
      type: GraphQLString,
      args: {
        id: { type: GraphQLString }
      },
      resolve: deviceResolvers.deleteDeviceMutationResolver
    },

    disableDevice: {
      name: 'disableDeviceMutationType',
      type: GraphQLString,
      args: {
        id: { type: GraphQLString }
      },
      resolve: deviceResolvers.disableDeviceMutationResolver
    },

    enableDevice: {
      name: 'enableDeviceMutationType',
      type: GraphQLString,
      args: {
        id: { type: GraphQLString }
      },
      resolve: deviceResolvers.enableDeviceMutationResolver
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
      resolve: stackResolvers.updateStackMutationResolver
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
      resolve: stackResolvers.duplicateStackMutationResolver
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
      resolve: stackResolvers.deleteStackMutationResolver
    },

    executeStack: {
      name: 'Trigger Stack',
      description: 'activates and runs a stack',
      type: GraphQLString,
      args: {
        id: {
          type: GraphQLString
        },
        controller: {
          type: GraphQLString
        }
      },
      resolve: stackResolvers.executeStackMutationResolver
    },

    executeAction: {
      name: 'Execure Action',
      description: 'Execute an arbitrary action with parameters outside of a stack context',
      type: GraphQLString,
      args: {
        action: {
          type: actionInputType
        }
      },
      resolve: stackResolvers.executeActionMutationResolver
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
      resolve: panelResolvers.panelMutationResolver
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
      resolve: panelResolvers.deletePanelMutationResolver
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
      resolve: bridgeResolvers.updateBridgeMutationResolver
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
      resolve: controllerResolvers.controllerMutationResolver
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
      resolve: controllerResolvers.deleteControllerMutationResolver
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
      resolve: coreResolvers.coreMutationResolver
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
      resolve: coreResolvers.createRealmMutationResolver
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
      resolve: coreResolvers.updateRealmMutationResolver
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
      resolve: coreResolvers.deleteRealmMutationResolver
    },

    updateTag: {
      name: 'updateTagMutation',
      description: 'Creates or updates a Tag',
      type: tagType,
      args: {
        tag: {
          type: tagInputType
        }
      },
      resolve: tagResolvers.updateTagMutationResolver
    },

    deleteTag: {
      name: 'deleteTagMutation',
      description: 'Removes a Tag from existance',
      type: GraphQLString,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: tagResolvers.deleteTagMutationResolver
    }
  }
})

export { mutations }
