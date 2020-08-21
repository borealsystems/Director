import {
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInputObjectType
} from 'graphql'

const deviceUpdateInputType = new GraphQLInputObjectType({
  name: 'deviceUpdate',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    enabled: {
      type: GraphQLBoolean
    },
    status: {
      type: GraphQLString
    },
    provider: {
      type: new GraphQLInputObjectType({
        name: 'deviceProviderDetailInputType',
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
    configuration: {
      type: new GraphQLList(
        new GraphQLInputObjectType({
          name: 'deviceUpdateConfigurationObject',
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

export default deviceUpdateInputType
