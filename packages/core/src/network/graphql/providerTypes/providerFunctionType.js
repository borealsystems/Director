import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

const providerFunctionType = new GraphQLObjectType({
  name: 'providerFunction',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    parameters: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'functionParameter',
          fields: {
            label: {
              type: GraphQLString
            },
            id: {
              type: GraphQLString
            },
            inputType: {
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

export default providerFunctionType
