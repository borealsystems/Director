import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import deviceType from '../deviceTypes/deviceType'
import stackPanelColourType from './stackPanelColourType'

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
    realm: {
      type: GraphQLString
    },
    core: {
      type: GraphQLString
    },
    colour: {
      type: stackPanelColourType
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
              type: deviceType
            },
            delay: {
              type: GraphQLInt
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
                      type: GraphQLJSON
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
