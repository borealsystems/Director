import {
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInputObjectType
} from 'graphql'

const newDeviceInputType = new GraphQLInputObjectType({
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
      })
    },
    configuration: {
      type: new GraphQLList(
        new GraphQLInputObjectType({
          name: 'deviceConfigurationInputType',
          fields: {
            id: {
              type: GraphQLString
            },
            name: {
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

export default newDeviceInputType
