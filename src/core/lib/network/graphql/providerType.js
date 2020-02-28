import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} from 'graphql'

const providerType = new GraphQLObjectType({
  name: 'Provider',
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
        new GraphQLObjectType({
          name: 'parameter',
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

export default providerType
