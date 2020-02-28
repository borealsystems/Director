import { logs } from '../../log'
import { providers } from '../providers'
import { devices } from '../../devices'
import db from '../../db'

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInputObjectType
  // GraphQLNonNull
} from 'graphql'
// import { GraphQLJSONObject } from 'graphql-type-json'

import providerType from './providerType'
import logType from './logType'
import deviceType from './deviceTypes/deviceType.js'

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
      createNewDevice: { // Set controller brightness by UUID
        type: deviceType,
        args: {
          input: {
            type: new GraphQLInputObjectType({
              name: 'newDevice',
              fields: {
                name: {
                  type: GraphQLString
                },
                location: {
                  type: GraphQLString
                },
                description: {
                  type: GraphQLString
                },
                provider: {
                  type: new GraphQLInputObjectType({
                    name: 'providerObject',
                    fields: {
                      id: {
                        type: GraphQLString
                      },
                      label: {
                        type: GraphQLString
                      },
                      protocol: {
                        type: GraphQLString
                      },
                      parameters: {
                        type: new GraphQLList(
                          new GraphQLInputObjectType({
                            name: 'parameterObject',
                            fields: {
                              required: {
                                type: GraphQLBoolean
                              },
                              id: {
                                type: GraphQLString
                              },
                              label: {
                                type: GraphQLString
                              },
                              regex: {
                                type: GraphQLString
                              }
                            }
                          })
                        )
                      }
                    }
                  }),
                  configuration: {
                    type: new GraphQLList(
                      new GraphQLInputObjectType({
                        name: 'newDeviceConfiguration',
                        fields: {
                          id: {
                            type: GraphQLString
                          },
                          value: {
                            type: GraphQLString
                          }
                        }
                      })
                    )
                  }
                }
              }
            })
          }
        },
        resolve: (parent, args) => {
          return ('there was an attempt')
        }
      }
    }
  })
})

export { schema }
