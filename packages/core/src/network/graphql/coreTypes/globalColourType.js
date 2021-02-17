import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const globalColourType = new GraphQLObjectType({
  name: 'globalColourType',
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

export default globalColourType
