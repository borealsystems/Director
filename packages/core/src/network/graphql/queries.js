import { bridgeResolvers } from '../../bridges/bridgeResolvers'
import { controllerResolvers } from '../../controllers/controllerResolvers'
import { deviceResolvers } from '../../devices/deviceResolvers'
import { stackResolvers } from '../../stacks/stackResolvers'
import { panelResolvers } from '../../panels/panelResolvers'
import { coreResolvers } from '../../coreResolvers'
import { tagResolvers } from '../../tags/tagResolvers'

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
import stackType from './stackTypes/stackType'
import globalColourType from './coreTypes/globalColourType'
import tagType from './tagTypes/tagType'

const queries = new GraphQLObjectType({
  name: 'Queries',
  fields: {
    status: {
      name: 'Get Status Slug',
      description: 'Returns a status slug to be displayed on the UI homepage',
      type: new GraphQLList(
        GraphQLString
      ),
      resolve: coreResolvers.statusQueryResolver
    },

    thisCore: {
      name: 'thisCore',
      description: 'Return this cores',
      type: coreType,
      resolve: coreResolvers.thisCoreQueryResolver
    },

    cores: {
      name: 'cores',
      description: 'Return cores',
      type: new GraphQLList(coreType),
      resolve: coreResolvers.coresQueryResolver
    },

    realms: {
      name: 'realmsQuery',
      description: 'Return realms',
      type: new GraphQLList(realmType),
      resolve: coreResolvers.realmsQueryResolver
    },

    realm: {
      name: 'realmQuery',
      description: 'Return realm',
      type: realmType,
      args: {
        realm: { type: GraphQLString },
        core: { type: GraphQLString }
      },
      resolve: coreResolvers.realmQueryResolver
    },

    logs: {
      name: 'Get Logs',
      description: 'Returns an array of logs from the core',
      type: new GraphQLList(logType),
      resolve: coreResolvers.logsQueryResolver
    },

    providers: {
      name: 'Get Communication Providers',
      description: 'Returns all available communication providers, the backend of a device and what defines available actions',
      type: new GraphQLList(providerType),
      resolve: coreResolvers.providersQueryResolver
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
      resolve: deviceResolvers.devicesQueryResolver
    },

    device: {
      name: 'Get Device by ID',
      description: 'Returns a device specified by the ID',
      type: deviceType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: deviceResolvers.deviceQueryResolver
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
      resolve: deviceResolvers.deviceFunctionsQueryResolver
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
      resolve: stackResolvers.stacksQuery
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
      resolve: stackResolvers.stackQuery
    },

    globalColours: {
      name: 'globalColours',
      description: 'All possible colours',
      type: new GraphQLList(globalColourType),
      resolve: coreResolvers.globalColoursQueryResolver
    },

    tags: {
      name: 'tags',
      description: 'All Configured Tags for this Realm',
      type: new GraphQLList(tagType),
      args: {
        realm: {
          type: GraphQLString
        },
        core: {
          type: GraphQLString
        }
      },
      resolve: tagResolvers.tagsQueryResolver
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
      resolve: panelResolvers.panelsQuery
    },

    panel: {
      name: 'Get Panel',
      description: 'Returns panel by id',
      type: panelType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: panelResolvers.panelQuery
    },

    getBridges: {
      name: 'Get Bridges',
      description: 'Returns all connected bridges',
      type: new GraphQLList(bridgeType),
      resolve: bridgeResolvers.getBridgesQueryResolver
    },

    controllerLayouts: {
      name: 'Get Controller Layouts',
      description: 'Returns an array of controller layouts',
      type: new GraphQLList(controllerLayoutType),
      resolve: controllerResolvers.controllerLayoutsQueryResolver
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
      resolve: controllerResolvers.controllersQueryResolver
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
      resolve: controllerResolvers.controllerQueryResolver
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
                  },
                  itemType: {
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
      resolve: coreResolvers.dependentsQueryResolver
    }
  }
})

export { queries }
