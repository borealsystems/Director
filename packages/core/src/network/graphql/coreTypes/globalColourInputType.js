import {
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql'

const globalColourInputType = new GraphQLInputObjectType({
  name: 'globalColourInputType',
  description: 'A Colour',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    }
  }
})

export default globalColourInputType
