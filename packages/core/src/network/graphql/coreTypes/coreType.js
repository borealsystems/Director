import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

const coreConfigType = new GraphQLObjectType({
  name: 'CoreConfigType',
  fields: {
    id: {
      type: GraphQLString
    },
    label: {
      type: GraphQLString
    },
    helpdeskVisable: {
      type: GraphQLBoolean
    },
    helpdeskURI: {
      type: GraphQLString
    },
    timezone: {
      type: GraphQLString
    }
  }
})

export default coreConfigType
