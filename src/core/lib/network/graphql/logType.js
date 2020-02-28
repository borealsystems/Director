import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql'

const logType = new GraphQLObjectType({
  name: 'LogItem',
  fields: {
    id: {
      type: GraphQLInt
    },
    time: {
      type: GraphQLString
    },
    level: {
      type: GraphQLString
    },
    path: {
      type: GraphQLString
    },
    message: {
      type: GraphQLString
    }
  }
})

export default logType
