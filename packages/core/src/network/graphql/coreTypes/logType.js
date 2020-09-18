import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

const logType = new GraphQLObjectType({
  name: 'LogItem',
  fields: {
    id: {
      type: GraphQLString
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
