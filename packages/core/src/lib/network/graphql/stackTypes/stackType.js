import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

const tmp =
{
  newStack: {
    name: 'test',
    description: 'test',
    actions: [
      {
        id: '0',
        deviceName: 'Reaper',
        functionLabel: 'Send String',
        device: {
          name: 'Reaper',
          id: 'EX2yoYHm9',
          provider: 'osc',
          __typename: 'Device'
        },
        function: {
          id: 'string',
          label: 'Send String',
          parameters: [
            {
              label: 'OSC Path',
              id: 'path',
              inputType: 'textInput',
              regex: null,
              __typename: 'functionParameter'
            },
            {
              label: 'Value',
              id: 'string',
              inputType: 'textInput',
              regex: '^-?\\d+$',
              __typename: 'functionParameter'
            }
          ],
          __typename: 'providerFunction'
        }
      }
    ]
  }
}

const stackType = new GraphQLObjectType({
  name: 'Stack',
  description: 'A Stack is a group of actions that can be triggered at once or sequentially by a controller',
  fields: {
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    actions: {
      type: new GraphQLList({
        fields: new GraphQLObjectType({
          name: 'stackActionType',
          description: 'An action is something that happens on a device or piece of software',
          fields: {
            id: {
              type: GraphQLString
            },
            deviceName: {
              type: GraphQLString
            },
            functionLabel: {
              type: GraphQLString
            },
            device: {
              type: new GraphQLObjectType({
                name: 'stackActionDevice',
                description: 'Which device this action uses',
                fields: {
                  id: {
                    type: GraphQLString
                  },
                  name: {
                    type: GraphQLString
                  },
                  provider: {
                    type: GraphQLString
                  }
                }
              })
            },
            // TODO MAKE THIS NOT FUNCTION IN THE BACKEND
            __function: {
              type: new GraphQLList({
                fields: new GraphQLObjectType({
                  name: 'stackActionType',
                  description: 'An action is something that happens on a device or piece of software',
                  fields: {
                    id: {
                      type: GraphQLString
                    },
                    deviceName: {
                      type: GraphQLString
                    },
                    functionLabel: {
                      type: GraphQLString
                    },
                    device: {
                      type: new GraphQLObjectType({
                        name: 'stackActionDevice',
                        description: 'Which device this action uses',
                        fields: {
                          id: {
                            type: GraphQLString
                          },
                          name: {
                            type: GraphQLString
                          },
                          provider: {
                            type: GraphQLString
                          }
                        }
                      })
                    },
                    function
                  }
                })
              })
            }
          }
        })
      })
    },
    status: {
      type: GraphQLBoolean
    }
  }
})

export default stackType
