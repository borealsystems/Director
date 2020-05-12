import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

const newStackInputType = new GraphQLInputObjectType({
  name: 'StackInput',
  description: 'A Stack is a group of actions that can be triggered at once or sequentially by a controller',
  fields: {
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    actions: {
      type: new GraphQLList(
        new GraphQLInputObjectType({
          name: 'stackActionInputType',
          description: 'An action is something that happens on a device or piece of software',
          fields: {
            id: {
              type: GraphQLString
            },
            deviceid: {
              type: GraphQLString
            },
            providerFunctionID: {
              type: GraphQLString
            },
            functionLabel: {
              type: GraphQLString
            },
            parameters: {
              type: new GraphQLList(
                new GraphQLInputObjectType({
                  name: 'stackActionParametersInputType',
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

export default newStackInputType
