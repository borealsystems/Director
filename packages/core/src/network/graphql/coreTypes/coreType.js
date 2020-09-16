import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'

import realmType from './realmType'

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
    },
    systemNotes: {
      type: GraphQLString
    },
    realms: {
      type: new GraphQLList(
        realmType
      )
    }
  }
})

export default coreConfigType
