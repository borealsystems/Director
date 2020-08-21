import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

const deviceType = new GraphQLObjectType({
  name: 'Device',
  fields: {
    label: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    provider: {
      type: new GraphQLObjectType({
        name: 'deviceProviderDetailType',
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
    enabled: {
      type: GraphQLBoolean
    },
    status: {
      type: GraphQLString
    },
    configuration: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'deviceConfigurationObject',
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

export default deviceType
