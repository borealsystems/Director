import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

const deviceType = new GraphQLObjectType({
  name: 'Device',
  fields: {
    name: {
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
      type: GraphQLString
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
          name: 'configurationItem',
          fields: {
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

export default deviceType
