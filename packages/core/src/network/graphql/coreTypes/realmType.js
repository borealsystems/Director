import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

const realmType = new GraphQLObjectType({
  name: 'realmType',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  }
})

export default realmType
