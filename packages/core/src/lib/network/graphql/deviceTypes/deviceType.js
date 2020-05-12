import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

import configurationType from './configurationType'

const deviceType = new GraphQLObjectType({
  name: 'Device',
  fields: {
    label: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    provider: {
      type: GraphQLString
    },
    enabled: {
      type: GraphQLBoolean
    },
    status: {
      type: GraphQLString
    },
    configuration: {
      type: new GraphQLList(configurationType)
    }
  }
})

export default deviceType
