import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

const stackType = new GraphQLObjectType({
  name: 'stackUpdateType',
  description: 'A Stack is a group of actions that can be triggered at once or sequentially by a controller',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    panelLabel: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    actions: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'stackActionType',
          description: 'An action is something that happens on a device or piece of software',
          fields: {
            id: {
              type: GraphQLString
            },
            device: {
              type: new GraphQLObjectType({
                name: 'stackDeviceType',
                fields: {
                  id: {
                    type: GraphQLString
                  },
                  label: {
                    type: GraphQLString
                  },
                  provider: {
                    type: new GraphQLObjectType({
                      name: 'stackDeviceProviderType',
                      fields: {
                        id: {
                          type: GraphQLString
                        }
                      }
                    })
                  }
                }
              })
            },
            providerFunction: {
              type: new GraphQLObjectType({
                name: 'stackDeviceProviderFunctionType',
                fields: {
                  id: {
                    type: GraphQLString
                  },
                  label: {
                    type: GraphQLString
                  }
                }
              })
            },
            parameters: {
              type: new GraphQLList(
                new GraphQLObjectType({
                  name: 'stackActionParametersType',
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
        })
      )
    }
  }
})

export default stackType
