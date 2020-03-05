import {
  GraphQLString,
  GraphQLObjectType
} from 'graphql'

const configurationType = new GraphQLObjectType({
  name: 'deviceConfigurationType',
  fields: {
    id: {
      type: GraphQLString
    },
    value: {
      type: GraphQLString
    }
  }
})

export default configurationType
