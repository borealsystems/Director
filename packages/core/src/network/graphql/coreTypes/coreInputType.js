import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

const coreInputType = new GraphQLInputObjectType({
  name: 'coreInputType',
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

export default coreInputType
