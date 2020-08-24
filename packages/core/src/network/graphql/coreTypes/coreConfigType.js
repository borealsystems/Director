import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql'

const coreConfigType = new GraphQLObjectType({
  name: 'CoreConfigType',
  fields: {
    label: {
      type: GraphQLString
    },
    mdns: {
      type: GraphQLBoolean
    },
    port: {
      type: GraphQLInt
    },
    address: {
      type: GraphQLString
    },
    helpdeskVisable: {
      type: GraphQLBoolean
    },
    helpdeskURI: {
      type: GraphQLString
    }
  }
})

export default coreConfigType
