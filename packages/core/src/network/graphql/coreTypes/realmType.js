import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

const realmType = new GraphQLObjectType({
  name: 'realmType',
  fields: {
    coreID: {
      type: GraphQLString
    },
    coreLabel: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    notes: {
      type: GraphQLString
    }
  }
})

export default realmType
