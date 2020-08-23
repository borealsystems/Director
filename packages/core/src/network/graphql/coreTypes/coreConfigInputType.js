import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql'

const coreConfigType = new GraphQLInputObjectType({
  name: 'coreConfigInputType',
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
    }
  }
})

export default coreConfigType
