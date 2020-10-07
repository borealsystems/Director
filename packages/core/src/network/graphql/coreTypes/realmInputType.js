import {
  GraphQLInputObjectType,
  GraphQLString
} from 'graphql'

const realmInputType = new GraphQLInputObjectType({
  name: 'realmInputType',
  fields: {
    coreID: {
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

export default realmInputType
